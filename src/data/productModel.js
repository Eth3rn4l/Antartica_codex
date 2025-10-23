/**
 * ===================================================
 * PRODUCT MODEL - GESTIÓN DE PRODUCTOS
 * ===================================================
 * 
 * Modelo para la gestión del catálogo de libros de Antártica.
 * Incluye operaciones CRUD y funcionalidades específicas.
 * 
 * FUNCIONALIDADES:
 * - Gestión completa del catálogo de libros
 * - Control de inventario y stock
 * - Categorización y filtros de búsqueda
 * - Gestión de precios e imágenes
 * - Validaciones específicas para libros
 * 
 * AUTOR: Sistema Antártica
 * FECHA: Octubre 2025
 * ===================================================
 */

import { dbManager } from './database.js';
import { BOOK_CATEGORIES, CATEGORY_LABELS } from '../utils/constantes.js';

// ===================================================
// CLASE PRODUCT MODEL
// ===================================================

/**
 * Clase ProductModel
 * Maneja todas las operaciones relacionadas con productos/libros
 */
export class ProductModel {
  constructor() {
    this.tableName = 'productos';
  }

  /**
   * Crea un nuevo producto en el catálogo
   * @param {Object} productData - Datos del producto a crear
   * @param {string} productData.titulo - Título del libro
   * @param {string} productData.autor - Autor(es) del libro
   * @param {string} productData.isbn - Código ISBN (opcional)
   * @param {string} productData.descripcion - Descripción del libro
   * @param {number} productData.precio - Precio en pesos chilenos
   * @param {number} productData.stock - Cantidad en inventario
   * @param {string} productData.categoria - Categoría del libro
   * @param {string} productData.imagen_url - URL de la imagen de portada
   * @param {string} productData.editorial - Casa editorial (opcional)
   * @param {number} productData.año_publicacion - Año de publicación (opcional)
   * @param {number} productData.paginas - Número de páginas (opcional)
   * @param {string} productData.idioma - Idioma del libro (default: español)
   * @returns {Promise<Object>} Producto creado con ID asignado
   */
  async createProduct(productData) {
    try {
      console.log('📚 Creando nuevo producto:', productData.titulo);
      
      // Validar datos de entrada
      this.validateProductData(productData);
      
      // Verificar que el ISBN no existe (si se proporciona)
      if (productData.isbn) {
        const existingProduct = await this.findByISBN(productData.isbn);
        if (existingProduct) {
          throw new Error('Ya existe un producto con este ISBN');
        }
      }

      // Preparar datos para inserción
      const productToCreate = {
        titulo: productData.titulo.trim(),
        autor: productData.autor.trim(),
        isbn: productData.isbn ? productData.isbn.trim() : null,
        descripcion: productData.descripcion ? productData.descripcion.trim() : null,
        precio: parseFloat(productData.precio),
        stock: parseInt(productData.stock),
        categoria: productData.categoria,
        imagen_url: productData.imagen_url ? productData.imagen_url.trim() : null,
        editorial: productData.editorial ? productData.editorial.trim() : null,
        año_publicacion: productData.año_publicacion ? parseInt(productData.año_publicacion) : null,
        paginas: productData.paginas ? parseInt(productData.paginas) : null,
        idioma: productData.idioma || 'español',
        estado: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Insertar en base de datos
      const query = `
        INSERT INTO ${this.tableName} 
        (titulo, autor, isbn, descripcion, precio, stock, categoria, imagen_url, 
         editorial, año_publicacion, paginas, idioma, estado, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        productToCreate.titulo,
        productToCreate.autor,
        productToCreate.isbn,
        productToCreate.descripcion,
        productToCreate.precio,
        productToCreate.stock,
        productToCreate.categoria,
        productToCreate.imagen_url,
        productToCreate.editorial,
        productToCreate.año_publicacion,
        productToCreate.paginas,
        productToCreate.idioma,
        productToCreate.estado,
        productToCreate.created_at,
        productToCreate.updated_at
      ];

      const result = await dbManager.executeQuery(query, params);
      
      // Obtener el producto creado
      const newProduct = await this.findById(result.insertId);
      
      console.log('✅ Producto creado exitosamente:', newProduct.titulo);
      return newProduct;
      
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      throw error;
    }
  }

  /**
   * Busca un producto por su ID
   * @param {number} productId - ID del producto
   * @returns {Promise<Object|null>} Producto encontrado o null
   */
  async findById(productId) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ? AND estado != 'deleted'`;
      const result = await dbManager.executeQuery(query, [productId]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('❌ Error al buscar producto por ID:', error);
      throw error;
    }
  }

  /**
   * Busca un producto por su ISBN
   * @param {string} isbn - Código ISBN del producto
   * @returns {Promise<Object|null>} Producto encontrado o null
   */
  async findByISBN(isbn) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE isbn = ? AND estado != 'deleted'`;
      const result = await dbManager.executeQuery(query, [isbn]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('❌ Error al buscar producto por ISBN:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los productos con filtros y paginación
   * @param {Object} options - Opciones de consulta
   * @param {number} options.page - Página actual (default: 1)
   * @param {number} options.limit - Productos por página (default: 12)
   * @param {string} options.search - Término de búsqueda (opcional)
   * @param {string} options.categoria - Filtro por categoría (opcional)
   * @param {string} options.autor - Filtro por autor (opcional)
   * @param {number} options.precioMin - Precio mínimo (opcional)
   * @param {number} options.precioMax - Precio máximo (opcional)
   * @param {boolean} options.soloConStock - Solo productos con stock > 0 (default: false)
   * @param {string} options.ordenar - Campo de ordenamiento (default: titulo)
   * @param {string} options.direccion - Dirección del ordenamiento (asc/desc, default: asc)
   * @returns {Promise<Object>} Lista paginada de productos
   */
  async getAllProducts(options = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        categoria = '',
        autor = '',
        precioMin = null,
        precioMax = null,
        soloConStock = false,
        ordenar = 'titulo',
        direccion = 'asc'
      } = options;

      const offset = (page - 1) * limit;
      let whereClause = "WHERE estado = 'active'";
      const params = [];

      // Filtro de búsqueda (título, autor, descripción)
      if (search) {
        whereClause += " AND (titulo LIKE ? OR autor LIKE ? OR descripcion LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Filtro por categoría
      if (categoria) {
        whereClause += " AND categoria = ?";
        params.push(categoria);
      }

      // Filtro por autor
      if (autor) {
        whereClause += " AND autor LIKE ?";
        params.push(`%${autor}%`);
      }

      // Filtro por rango de precios
      if (precioMin !== null) {
        whereClause += " AND precio >= ?";
        params.push(precioMin);
      }
      if (precioMax !== null) {
        whereClause += " AND precio <= ?";
        params.push(precioMax);
      }

      // Filtro solo con stock
      if (soloConStock) {
        whereClause += " AND stock > 0";
      }

      // Validar campo de ordenamiento
      const camposValidos = ['titulo', 'autor', 'precio', 'stock', 'año_publicacion', 'created_at'];
      const campoOrden = camposValidos.includes(ordenar) ? ordenar : 'titulo';
      const direccionOrden = direccion.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

      // Consulta principal
      const query = `
        SELECT * FROM ${this.tableName} 
        ${whereClause}
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
        products: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          search,
          categoria,
          autor,
          precioMin,
          precioMax,
          soloConStock,
          ordenar: campoOrden,
          direccion: direccionOrden
        }
      };
      
    } catch (error) {
      console.error('❌ Error al obtener productos:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos por categoría
   * @param {string} categoria - Categoría a filtrar
   * @param {number} limit - Límite de productos (default: 10)
   * @returns {Promise<Array>} Lista de productos de la categoría
   */
  async getProductsByCategory(categoria, limit = 10) {
    try {
      const query = `
        SELECT * FROM ${this.tableName} 
        WHERE categoria = ? AND estado = 'active'
        ORDER BY titulo ASC
        LIMIT ?
      `;
      
      const result = await dbManager.executeQuery(query, [categoria, limit]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos con stock bajo
   * @param {number} threshold - Umbral de stock bajo (default: 5)
   * @returns {Promise<Array>} Lista de productos con stock bajo
   */
  async getLowStockProducts(threshold = 5) {
    try {
      const query = `
        SELECT * FROM ${this.tableName} 
        WHERE stock <= ? AND stock > 0 AND estado = 'active'
        ORDER BY stock ASC, titulo ASC
      `;
      
      const result = await dbManager.executeQuery(query, [threshold]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error al obtener productos con stock bajo:', error);
      throw error;
    }
  }

  /**
   * Actualiza los datos de un producto
   * @param {number} productId - ID del producto a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(productId, updateData) {
    try {
      console.log('✏️ Actualizando producto:', productId);
      
      // Validar que el producto existe
      const existingProduct = await this.findById(productId);
      if (!existingProduct) {
        throw new Error('Producto no encontrado');
      }

      // Campos permitidos para actualización
      const allowedFields = [
        'titulo', 'autor', 'isbn', 'descripcion', 'precio', 'stock',
        'categoria', 'imagen_url', 'editorial', 'año_publicacion',
        'paginas', 'idioma', 'estado'
      ];

      const fieldsToUpdate = [];
      const params = [];

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          fieldsToUpdate.push(`${field} = ?`);
          
          // Procesar según el tipo de campo
          if (['precio', 'stock', 'año_publicacion', 'paginas'].includes(field)) {
            params.push(parseFloat(updateData[field]) || 0);
          } else {
            params.push(updateData[field]);
          }
        }
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      // Agregar updated_at
      fieldsToUpdate.push('updated_at = ?');
      params.push(new Date());
      
      // Agregar productId al final
      params.push(productId);

      const query = `
        UPDATE ${this.tableName} 
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = ?
      `;

      await dbManager.executeQuery(query, params);
      
      // Retornar producto actualizado
      const updatedProduct = await this.findById(productId);
      console.log('✅ Producto actualizado exitosamente:', productId);
      
      return updatedProduct;
      
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      throw error;
    }
  }

  /**
   * Actualiza el stock de un producto
   * @param {number} productId - ID del producto
   * @param {number} newStock - Nuevo valor de stock
   * @returns {Promise<Object>} Producto con stock actualizado
   */
  async updateStock(productId, newStock) {
    try {
      console.log('📦 Actualizando stock del producto:', productId, 'nuevo stock:', newStock);
      
      const product = await this.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (newStock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      const query = `
        UPDATE ${this.tableName} 
        SET stock = ?, updated_at = ?
        WHERE id = ?
      `;
      
      await dbManager.executeQuery(query, [parseInt(newStock), new Date(), productId]);
      
      const updatedProduct = await this.findById(productId);
      console.log('✅ Stock actualizado exitosamente para producto:', productId);
      
      return updatedProduct;
      
    } catch (error) {
      console.error('❌ Error al actualizar stock:', error);
      throw error;
    }
  }

  /**
   * Reduce el stock de un producto (para ventas)
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad a reducir
   * @returns {Promise<Object>} Producto con stock actualizado
   */
  async reduceStock(productId, quantity) {
    try {
      const product = await this.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (product.stock < quantity) {
        throw new Error('Stock insuficiente');
      }

      const newStock = product.stock - quantity;
      return await this.updateStock(productId, newStock);
      
    } catch (error) {
      console.error('❌ Error al reducir stock:', error);
      throw error;
    }
  }

  /**
   * Elimina (desactiva) un producto
   * @param {number} productId - ID del producto a eliminar
   * @returns {Promise<boolean>} True si se eliminó exitosamente
   */
  async deleteProduct(productId) {
    try {
      console.log('🗑️ Eliminando producto:', productId);
      
      const product = await this.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Soft delete: cambiar estado a 'deleted'
      const query = `
        UPDATE ${this.tableName} 
        SET estado = 'deleted', updated_at = ?
        WHERE id = ?
      `;
      
      await dbManager.executeQuery(query, [new Date(), productId]);
      
      console.log('✅ Producto eliminado exitosamente:', productId);
      return true;
      
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      throw error;
    }
  }

  /**
   * Obtiene las categorías disponibles con conteo de productos
   * @returns {Promise<Array>} Lista de categorías con conteos
   */
  async getCategories() {
    try {
      const query = `
        SELECT 
          categoria,
          COUNT(*) as total_productos,
          SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END) as productos_con_stock
        FROM ${this.tableName} 
        WHERE estado = 'active'
        GROUP BY categoria
        ORDER BY categoria ASC
      `;
      
      const result = await dbManager.executeQuery(query);
      
      // Agregar etiquetas legibles
      return result.rows.map(cat => ({
        ...cat,
        label: CATEGORY_LABELS[cat.categoria.toUpperCase()] || cat.categoria
      }));
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Valida los datos de producto antes de crear/actualizar
   * @param {Object} productData - Datos del producto a validar
   * @throws {Error} Si los datos no son válidos
   */
  validateProductData(productData) {
    if (!productData.titulo || productData.titulo.trim().length < 2) {
      throw new Error('Título debe tener al menos 2 caracteres');
    }

    if (!productData.autor || productData.autor.trim().length < 2) {
      throw new Error('Autor debe tener al menos 2 caracteres');
    }

    if (!productData.precio || productData.precio <= 0) {
      throw new Error('Precio debe ser mayor a 0');
    }

    if (!productData.stock || productData.stock < 0) {
      throw new Error('Stock no puede ser negativo');
    }

    if (!productData.categoria || !Object.values(BOOK_CATEGORIES).includes(productData.categoria)) {
      throw new Error('Categoría inválida');
    }

    if (productData.isbn && !/^[0-9\-X]{10,17}$/.test(productData.isbn.replace(/\s/g, ''))) {
      throw new Error('ISBN inválido');
    }

    if (productData.año_publicacion) {
      const año = parseInt(productData.año_publicacion);
      const añoActual = new Date().getFullYear();
      if (año < 1000 || año > añoActual + 1) {
        throw new Error('Año de publicación inválido');
      }
    }
  }

  /**
   * Obtiene estadísticas de productos para el dashboard admin
   * @returns {Promise<Object>} Estadísticas de productos
   */
  async getProductStats() {
    try {
      const queries = {
        total: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = 'active'`,
        conStock: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = 'active' AND stock > 0`,
        sinStock: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = 'active' AND stock = 0`,
        stockBajo: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = 'active' AND stock <= 5 AND stock > 0`,
        valorInventario: `SELECT SUM(precio * stock) as valor FROM ${this.tableName} WHERE estado = 'active'`
      };

      const results = await Promise.all(
        Object.entries(queries).map(async ([key, query]) => {
          const result = await dbManager.executeQuery(query);
          return [key, result.rows[0].count || result.rows[0].valor || 0];
        })
      );

      return Object.fromEntries(results);
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de productos:', error);
      throw error;
    }
  }

  /**
   * Busca productos similares (por autor o categoría)
   * @param {number} productId - ID del producto de referencia
   * @param {number} limit - Límite de resultados (default: 5)
   * @returns {Promise<Array>} Lista de productos similares
   */
  async getSimilarProducts(productId, limit = 5) {
    try {
      const product = await this.findById(productId);
      if (!product) {
        return [];
      }

      const query = `
        SELECT * FROM ${this.tableName} 
        WHERE id != ? 
        AND estado = 'active' 
        AND (autor LIKE ? OR categoria = ?)
        ORDER BY 
          CASE WHEN autor LIKE ? THEN 1 ELSE 2 END,
          RAND()
        LIMIT ?
      `;
      
      const authorPattern = `%${product.autor}%`;
      const params = [productId, authorPattern, product.categoria, authorPattern, limit];
      
      const result = await dbManager.executeQuery(query, params);
      return result.rows;
    } catch (error) {
      console.error('❌ Error al obtener productos similares:', error);
      throw error;
    }
  }
}

// ===================================================
// INSTANCIA SINGLETON DEL MODELO DE PRODUCTOS
// ===================================================

/**
 * Instancia única del modelo de productos
 * Se exporta para uso en toda la aplicación
 */
export const productModel = new ProductModel();

/**
 * Función de utilidad para obtener el modelo de productos
 * @returns {ProductModel} Instancia del modelo de productos
 */
export const getProductModel = () => productModel;

// ===================================================
// EXPORTACIÓN POR DEFECTO
// ===================================================

export default productModel;
