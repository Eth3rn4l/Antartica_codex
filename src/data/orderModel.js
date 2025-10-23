/**
 * ===================================================
 * ORDER MODEL - GESTIÓN DE PEDIDOS
 * ===================================================
 * 
 * Modelo para la gestión de pedidos y órdenes de compra.
 * Incluye operaciones CRUD y funcionalidades específicas.
 * 
 * FUNCIONALIDADES:
 * - Creación y gestión de pedidos
 * - Control de estados de pedidos
 * - Cálculo de totales e impuestos (IVA 19%)
 * - Gestión de métodos de pago
 * - Tracking de envíos y entregas
 * 
 * AUTOR: Sistema Antártica
 * FECHA: Octubre 2025
 * ===================================================
 */

import { dbManager } from './database.js';
import { productModel } from './productModel.js';

// ===================================================
// CONSTANTES DE PEDIDOS
// ===================================================

/**
 * Estados posibles de un pedido
 */
export const ORDER_STATES = {
  PENDING: 'pending',           // Pendiente de confirmación
  CONFIRMED: 'confirmed',       // Confirmado por el cliente
  PROCESSING: 'processing',     // En preparación
  SHIPPED: 'shipped',          // Enviado
  DELIVERED: 'delivered',      // Entregado
  CANCELLED: 'cancelled'       // Cancelado
};

/**
 * Métodos de pago disponibles
 */
export const PAYMENT_METHODS = {
  WEBPAY: 'webpay',           // WebPay Plus (Transbank)
  TRANSFER: 'transferencia',   // Transferencia bancaria
  CREDIT: 'credito',          // Tarjeta de crédito
  DEBIT: 'debito'             // Tarjeta de débito
};

/**
 * Configuración de impuestos y envío
 */
export const ORDER_CONFIG = {
  IVA_RATE: 0.19,             // IVA 19%
  FREE_SHIPPING_THRESHOLD: 50000,  // Envío gratis sobre $50.000
  SHIPPING_COST: 5990,        // Costo envío estándar
  EXPRESS_SHIPPING_COST: 9990 // Costo envío express
};

// ===================================================
// CLASE ORDER MODEL
// ===================================================

/**
 * Clase OrderModel
 * Maneja todas las operaciones relacionadas con pedidos
 */
export class OrderModel {
  constructor() {
    this.tableName = 'pedidos';
    this.detailTableName = 'detalle_pedidos';
  }

  /**
   * Crea un nuevo pedido en el sistema
   * @param {Object} orderData - Datos del pedido
   * @param {number} orderData.usuario_id - ID del usuario que realiza el pedido
   * @param {Array} orderData.items - Array de items del pedido
   * @param {string} orderData.direccion_envio - Dirección de envío
   * @param {string} orderData.metodo_pago - Método de pago
   * @param {string} orderData.notas - Notas adicionales (opcional)
   * @param {boolean} orderData.envio_express - Envío express (opcional)
   * @returns {Promise<Object>} Pedido creado con detalles
   */
  async createOrder(orderData) {
    try {
      console.log('🛒 Creando nuevo pedido para usuario:', orderData.usuario_id);
      
      // Validar datos de entrada
      this.validateOrderData(orderData);
      
      // Verificar stock de todos los productos
      await this.validateStock(orderData.items);
      
      // Calcular totales
      const calculations = await this.calculateOrderTotals(orderData.items, orderData.envio_express);
      
      // Generar número de pedido único
      const numeroPedido = await this.generateOrderNumber();
      
      // Iniciar transacción
      await dbManager.beginTransaction();
      
      try {
        // Crear el pedido principal
        const orderToCreate = {
          usuario_id: orderData.usuario_id,
          numero_pedido: numeroPedido,
          total: calculations.total,
          subtotal: calculations.subtotal,
          impuestos: calculations.impuestos,
          envio: calculations.envio,
          estado: ORDER_STATES.PENDING,
          metodo_pago: orderData.metodo_pago,
          direccion_envio: orderData.direccion_envio.trim(),
          notas: orderData.notas ? orderData.notas.trim() : null,
          fecha_pedido: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        };

        const orderQuery = `
          INSERT INTO ${this.tableName} 
          (usuario_id, numero_pedido, total, subtotal, impuestos, envio, estado, 
           metodo_pago, direccion_envio, notas, fecha_pedido, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const orderParams = [
          orderToCreate.usuario_id,
          orderToCreate.numero_pedido,
          orderToCreate.total,
          orderToCreate.subtotal,
          orderToCreate.impuestos,
          orderToCreate.envio,
          orderToCreate.estado,
          orderToCreate.metodo_pago,
          orderToCreate.direccion_envio,
          orderToCreate.notas,
          orderToCreate.fecha_pedido,
          orderToCreate.created_at,
          orderToCreate.updated_at
        ];

        const orderResult = await dbManager.executeQuery(orderQuery, orderParams);
        const orderId = orderResult.insertId;

        // Crear los detalles del pedido
        await this.createOrderDetails(orderId, orderData.items);
        
        // Reducir stock de los productos
        await this.updateProductsStock(orderData.items);
        
        // Confirmar transacción
        await dbManager.commitTransaction();
        
        // Obtener el pedido completo creado
        const newOrder = await this.findById(orderId);
        
        console.log('✅ Pedido creado exitosamente:', numeroPedido);
        return newOrder;
        
      } catch (error) {
        // Revertir transacción en caso de error
        await dbManager.rollbackTransaction();
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      throw error;
    }
  }

  /**
   * Busca un pedido por su ID
   * @param {number} orderId - ID del pedido
   * @returns {Promise<Object|null>} Pedido encontrado con detalles o null
   */
  async findById(orderId) {
    try {
      // Obtener pedido principal
      const orderQuery = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      const orderResult = await dbManager.executeQuery(orderQuery, [orderId]);
      
      if (orderResult.rows.length === 0) {
        return null;
      }
      
      const order = orderResult.rows[0];
      
      // Obtener detalles del pedido con información de productos
      const detailsQuery = `
        SELECT 
          dp.*,
          p.titulo,
          p.autor,
          p.imagen_url
        FROM ${this.detailTableName} dp
        LEFT JOIN productos p ON dp.producto_id = p.id
        WHERE dp.pedido_id = ?
        ORDER BY dp.id
      `;
      
      const detailsResult = await dbManager.executeQuery(detailsQuery, [orderId]);
      
      return {
        ...order,
        items: detailsResult.rows
      };
    } catch (error) {
      console.error('❌ Error al buscar pedido por ID:', error);
      throw error;
    }
  }

  /**
   * Busca un pedido por su número
   * @param {string} numeroOrder - Número del pedido
   * @returns {Promise<Object|null>} Pedido encontrado o null
   */
  async findByNumber(numeroOrder) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE numero_pedido = ?`;
      const result = await dbManager.executeQuery(query, [numeroOrder]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return await this.findById(result.rows[0].id);
    } catch (error) {
      console.error('❌ Error al buscar pedido por número:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pedidos con filtros y paginación
   * @param {Object} options - Opciones de consulta
   * @param {number} options.page - Página actual (default: 1)
   * @param {number} options.limit - Pedidos por página (default: 20)
   * @param {number} options.usuario_id - Filtro por usuario (opcional)
   * @param {string} options.estado - Filtro por estado (opcional)
   * @param {string} options.metodo_pago - Filtro por método de pago (opcional)
   * @param {string} options.fechaDesde - Fecha desde (YYYY-MM-DD, opcional)
   * @param {string} options.fechaHasta - Fecha hasta (YYYY-MM-DD, opcional)
   * @param {string} options.ordenar - Campo de ordenamiento (default: fecha_pedido)
   * @param {string} options.direccion - Dirección del ordenamiento (asc/desc, default: desc)
   * @returns {Promise<Object>} Lista paginada de pedidos
   */
  async getAllOrders(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        usuario_id = null,
        estado = '',
        metodo_pago = '',
        fechaDesde = '',
        fechaHasta = '',
        ordenar = 'fecha_pedido',
        direccion = 'desc'
      } = options;

      const offset = (page - 1) * limit;
      let whereClause = "WHERE 1=1";
      const params = [];

      // Filtro por usuario
      if (usuario_id) {
        whereClause += " AND usuario_id = ?";
        params.push(usuario_id);
      }

      // Filtro por estado
      if (estado) {
        whereClause += " AND estado = ?";
        params.push(estado);
      }

      // Filtro por método de pago
      if (metodo_pago) {
        whereClause += " AND metodo_pago = ?";
        params.push(metodo_pago);
      }

      // Filtro por rango de fechas
      if (fechaDesde) {
        whereClause += " AND DATE(fecha_pedido) >= ?";
        params.push(fechaDesde);
      }
      if (fechaHasta) {
        whereClause += " AND DATE(fecha_pedido) <= ?";
        params.push(fechaHasta);
      }

      // Validar campo de ordenamiento
      const camposValidos = ['fecha_pedido', 'total', 'estado', 'numero_pedido'];
      const campoOrden = camposValidos.includes(ordenar) ? ordenar : 'fecha_pedido';
      const direccionOrden = direccion.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      // Consulta principal
      const query = `
        SELECT 
          p.*,
          u.nombre as usuario_nombre,
          u.email as usuario_email,
          COUNT(dp.id) as cantidad_items
        FROM ${this.tableName} p
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN ${this.detailTableName} dp ON p.id = dp.pedido_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY ${campoOrden} ${direccionOrden}
        LIMIT ? OFFSET ?
      `;
      params.push(limit, offset);

      // Consulta de conteo
      const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
      const countParams = params.slice(0, -2); // Excluir LIMIT y OFFSET

      const [result, countResult] = await Promise.all([
        dbManager.executeQuery(query, params),
        dbManager.executeQuery(countQuery, countParams)
      ]);

      const total = countResult.rows[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        orders: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
      
    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error);
      throw error;
    }
  }

  /**
   * Actualiza el estado de un pedido
   * @param {number} orderId - ID del pedido
   * @param {string} newState - Nuevo estado del pedido
   * @param {string} notes - Notas adicionales (opcional)
   * @returns {Promise<Object>} Pedido actualizado
   */
  async updateOrderState(orderId, newState, notes = null) {
    try {
      console.log('📋 Actualizando estado del pedido:', orderId, 'a:', newState);
      
      // Validar que el pedido existe
      const existingOrder = await this.findById(orderId);
      if (!existingOrder) {
        throw new Error('Pedido no encontrado');
      }

      // Validar nuevo estado
      if (!Object.values(ORDER_STATES).includes(newState)) {
        throw new Error('Estado de pedido inválido');
      }

      const fieldsToUpdate = ['estado = ?', 'updated_at = ?'];
      const params = [newState, new Date()];

      // Actualizar fechas específicas según el estado
      if (newState === ORDER_STATES.SHIPPED && !existingOrder.fecha_envio) {
        fieldsToUpdate.push('fecha_envio = ?');
        params.push(new Date());
      }
      
      if (newState === ORDER_STATES.DELIVERED && !existingOrder.fecha_entrega) {
        fieldsToUpdate.push('fecha_entrega = ?');
        params.push(new Date());
      }

      // Agregar notas si se proporcionan
      if (notes) {
        fieldsToUpdate.push('notas = ?');
        params.push(notes);
      }

      params.push(orderId);

      const query = `
        UPDATE ${this.tableName} 
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = ?
      `;

      await dbManager.executeQuery(query, params);
      
      const updatedOrder = await this.findById(orderId);
      console.log('✅ Estado del pedido actualizado exitosamente');
      
      return updatedOrder;
      
    } catch (error) {
      console.error('❌ Error al actualizar estado del pedido:', error);
      throw error;
    }
  }

  /**
   * Cancela un pedido
   * @param {number} orderId - ID del pedido a cancelar
   * @param {string} reason - Razón de la cancelación
   * @returns {Promise<Object>} Pedido cancelado
   */
  async cancelOrder(orderId, reason = 'Cancelado por el usuario') {
    try {
      console.log('❌ Cancelando pedido:', orderId);
      
      const order = await this.findById(orderId);
      if (!order) {
        throw new Error('Pedido no encontrado');
      }

      // Solo se pueden cancelar pedidos en ciertos estados
      const cancellableStates = [ORDER_STATES.PENDING, ORDER_STATES.CONFIRMED, ORDER_STATES.PROCESSING];
      if (!cancellableStates.includes(order.estado)) {
        throw new Error('El pedido no puede ser cancelado en su estado actual');
      }

      await dbManager.beginTransaction();

      try {
        // Actualizar estado del pedido
        await this.updateOrderState(orderId, ORDER_STATES.CANCELLED, reason);
        
        // Restaurar stock de los productos
        if (order.items && order.items.length > 0) {
          await this.restoreProductsStock(order.items);
        }

        await dbManager.commitTransaction();
        
        console.log('✅ Pedido cancelado exitosamente');
        return await this.findById(orderId);
        
      } catch (error) {
        await dbManager.rollbackTransaction();
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Error al cancelar pedido:', error);
      throw error;
    }
  }

  /**
   * Genera un número único de pedido
   * @returns {Promise<string>} Número de pedido único (ANT-YYYYMMDD-XXXX)
   */
  async generateOrderNumber() {
    try {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      // Buscar el último número del día
      const query = `
        SELECT numero_pedido 
        FROM ${this.tableName} 
        WHERE numero_pedido LIKE ? 
        ORDER BY numero_pedido DESC 
        LIMIT 1
      `;
      
      const pattern = `ANT-${dateStr}-%`;
      const result = await dbManager.executeQuery(query, [pattern]);
      
      let sequence = 1;
      if (result.rows.length > 0) {
        const lastNumber = result.rows[0].numero_pedido;
        const lastSequence = parseInt(lastNumber.split('-')[2]);
        sequence = lastSequence + 1;
      }
      
      return `ANT-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('❌ Error al generar número de pedido:', error);
      throw error;
    }
  }

  /**
   * Crea los detalles del pedido
   * @param {number} orderId - ID del pedido
   * @param {Array} items - Items del pedido
   * @returns {Promise<void>}
   */
  async createOrderDetails(orderId, items) {
    try {
      const detailsQuery = `
        INSERT INTO ${this.detailTableName} 
        (pedido_id, producto_id, cantidad, precio_unitario, subtotal, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      for (const item of items) {
        const product = await productModel.findById(item.producto_id);
        if (!product) {
          throw new Error(`Producto ${item.producto_id} no encontrado`);
        }

        const subtotal = item.cantidad * product.precio;
        
        await dbManager.executeQuery(detailsQuery, [
          orderId,
          item.producto_id,
          item.cantidad,
          product.precio,
          subtotal,
          new Date()
        ]);
      }
    } catch (error) {
      console.error('❌ Error al crear detalles del pedido:', error);
      throw error;
    }
  }

  /**
   * Calcula los totales del pedido
   * @param {Array} items - Items del pedido
   * @param {boolean} envioExpress - Si es envío express
   * @returns {Promise<Object>} Cálculos del pedido
   */
  async calculateOrderTotals(items, envioExpress = false) {
    try {
      let subtotal = 0;

      for (const item of items) {
        const product = await productModel.findById(item.producto_id);
        if (!product) {
          throw new Error(`Producto ${item.producto_id} no encontrado`);
        }
        subtotal += item.cantidad * product.precio;
      }

      const impuestos = subtotal * ORDER_CONFIG.IVA_RATE;
      
      let envio = 0;
      if (subtotal < ORDER_CONFIG.FREE_SHIPPING_THRESHOLD) {
        envio = envioExpress ? ORDER_CONFIG.EXPRESS_SHIPPING_COST : ORDER_CONFIG.SHIPPING_COST;
      }

      const total = subtotal + impuestos + envio;

      return {
        subtotal: Math.round(subtotal),
        impuestos: Math.round(impuestos),
        envio: Math.round(envio),
        total: Math.round(total)
      };
    } catch (error) {
      console.error('❌ Error al calcular totales:', error);
      throw error;
    }
  }

  /**
   * Valida el stock disponible para todos los items
   * @param {Array} items - Items a validar
   * @returns {Promise<void>}
   */
  async validateStock(items) {
    for (const item of items) {
      const product = await productModel.findById(item.producto_id);
      if (!product) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }
      if (product.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${product.titulo}. Disponible: ${product.stock}, Solicitado: ${item.cantidad}`);
      }
    }
  }

  /**
   * Actualiza el stock de productos tras una venta
   * @param {Array} items - Items vendidos
   * @returns {Promise<void>}
   */
  async updateProductsStock(items) {
    for (const item of items) {
      await productModel.reduceStock(item.producto_id, item.cantidad);
    }
  }

  /**
   * Restaura el stock de productos tras cancelación
   * @param {Array} items - Items a restaurar
   * @returns {Promise<void>}
   */
  async restoreProductsStock(items) {
    for (const item of items) {
      const product = await productModel.findById(item.producto_id);
      if (product) {
        const newStock = product.stock + item.cantidad;
        await productModel.updateStock(item.producto_id, newStock);
      }
    }
  }

  /**
   * Valida los datos del pedido
   * @param {Object} orderData - Datos del pedido a validar
   * @throws {Error} Si los datos no son válidos
   */
  validateOrderData(orderData) {
    if (!orderData.usuario_id) {
      throw new Error('ID de usuario requerido');
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('El pedido debe tener al menos un item');
    }

    if (!orderData.direccion_envio || orderData.direccion_envio.trim().length < 10) {
      throw new Error('Dirección de envío debe tener al menos 10 caracteres');
    }

    if (!orderData.metodo_pago || !Object.values(PAYMENT_METHODS).includes(orderData.metodo_pago)) {
      throw new Error('Método de pago inválido');
    }

    // Validar items individuales
    for (const item of orderData.items) {
      if (!item.producto_id || !item.cantidad || item.cantidad <= 0) {
        throw new Error('Cada item debe tener producto_id y cantidad válidos');
      }
    }
  }

  /**
   * Obtiene estadísticas de pedidos para el dashboard admin
   * @returns {Promise<Object>} Estadísticas de pedidos
   */
  async getOrderStats() {
    try {
      const queries = {
        total: `SELECT COUNT(*) as count FROM ${this.tableName}`,
        pendientes: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = '${ORDER_STATES.PENDING}'`,
        procesando: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = '${ORDER_STATES.PROCESSING}'`,
        enviados: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = '${ORDER_STATES.SHIPPED}'`,
        entregados: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = '${ORDER_STATES.DELIVERED}'`,
        ventasHoy: `
          SELECT COALESCE(SUM(total), 0) as ventas 
          FROM ${this.tableName} 
          WHERE DATE(fecha_pedido) = CURDATE() 
          AND estado != '${ORDER_STATES.CANCELLED}'
        `,
        ventasMes: `
          SELECT COALESCE(SUM(total), 0) as ventas 
          FROM ${this.tableName} 
          WHERE MONTH(fecha_pedido) = MONTH(CURDATE()) 
          AND YEAR(fecha_pedido) = YEAR(CURDATE())
          AND estado != '${ORDER_STATES.CANCELLED}'
        `
      };

      const results = await Promise.all(
        Object.entries(queries).map(async ([key, query]) => {
          const result = await dbManager.executeQuery(query);
          return [key, result.rows[0].count || result.rows[0].ventas || 0];
        })
      );

      return Object.fromEntries(results);
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de pedidos:', error);
      throw error;
    }
  }
}

// ===================================================
// INSTANCIA SINGLETON DEL MODELO DE PEDIDOS
// ===================================================

/**
 * Instancia única del modelo de pedidos
 * Se exporta para uso en toda la aplicación
 */
export const orderModel = new OrderModel();

/**
 * Función de utilidad para obtener el modelo de pedidos
 * @returns {OrderModel} Instancia del modelo de pedidos
 */
export const getOrderModel = () => orderModel;

// ===================================================
// EXPORTACIÓN POR DEFECTO
// ===================================================

export default orderModel;
