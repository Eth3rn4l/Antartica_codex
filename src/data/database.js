/**
 * ===================================================
 * DATABASE MANAGER - ANTÁRTICA E-COMMERCE
 * ===================================================
 * 
 * Este módulo maneja todas las operaciones de base de datos
 * para el sistema de e-commerce Antártica.
 * 
 * CARACTERÍSTICAS:
 * - Conexión con base de datos (preparado para MySQL/PostgreSQL/MongoDB)
 * - Operaciones CRUD para usuarios, productos, pedidos
 * - Gestión de sesiones y autenticación
 * - Preparado para migración desde localStorage a BD real
 * 
 * CONFIGURACIÓN DE BASE DE DATOS:
 * ===============================
 * 
 * 1. INSTALACIÓN DE DEPENDENCIAS:
 *    - Para PostgreSQL: npm install pg
 *    - Para MySQL: npm install mysql2
 *    - Para MongoDB: npm install mongodb
 *    - Para encriptación: npm install bcrypt
 * 
 * 2. VARIABLES DE ENTORNO (.env):
 *    DB_HOST=localhost              // AQUÍ VA LA DIRECCIÓN DEL SERVIDOR
 *    DB_PORT=5432                   // AQUÍ VA EL PUERTO (5432 PostgreSQL, 3306 MySQL, 27017 MongoDB)
 *    DB_NAME=antartica_db           // AQUÍ VA EL NOMBRE DE TU BASE DE DATOS
 *    DB_USER=tu_usuario             // AQUÍ VA TU USUARIO DE BASE DE DATOS
 *    DB_PASSWORD=tu_contraseña      // AQUÍ VA TU CONTRASEÑA
 *    DB_DIALECT=postgres            // AQUÍ VA EL TIPO: postgres, mysql, mongodb
 * 
 * 3. CREAR LA BASE DE DATOS:
 *    - Ejecutar los scripts SQL que están en DATABASE_INTEGRATION_GUIDE.md
 * 
 * AUTOR: Sistema Antártica
 * FECHA: Octubre 2025
 * ===================================================
 */

// ===================================================
// CONFIGURACIÓN DE BASE DE DATOS
// ===================================================

/**
 * Configuración de conexión a la base de datos
 * Estas variables deben configurarse según el entorno
 */
export const DB_CONFIG = {  // Configuración para desarrollo local
  development: {
    host: process.env.DB_HOST || 'localhost', // AQUÍ VA LA DIRECCIÓN DEL SERVIDOR DE BASE DE DATOS
    port: process.env.DB_PORT || 5432, // AQUÍ VA EL PUERTO DE LA BASE DE DATOS (5432 para PostgreSQL, 3306 para MySQL)
    database: process.env.DB_NAME || 'antartica_db', // AQUÍ VA EL NOMBRE DE LA BASE DE DATOS
    username: process.env.DB_USER || 'postgres', // AQUÍ VA EL USUARIO DE LA BASE DE DATOS
    password: process.env.DB_PASSWORD || '', // AQUÍ VA LA CONTRASEÑA DE LA BASE DE DATOS
    dialect: process.env.DB_DIALECT || 'postgres', // AQUÍ VA EL TIPO DE BASE DE DATOS: 'mysql', 'postgres', 'mongodb'
  },
    // Configuración para producción
  production: {
    host: process.env.DB_HOST, // AQUÍ VA LA DIRECCIÓN DEL SERVIDOR DE PRODUCCIÓN
    port: process.env.DB_PORT, // AQUÍ VA EL PUERTO DE PRODUCCIÓN
    database: process.env.DB_NAME, // AQUÍ VA EL NOMBRE DE LA BASE DE DATOS DE PRODUCCIÓN
    username: process.env.DB_USER, // AQUÍ VA EL USUARIO DE PRODUCCIÓN
    password: process.env.DB_PASSWORD, // AQUÍ VA LA CONTRASEÑA DE PRODUCCIÓN
    dialect: process.env.DB_DIALECT, // AQUÍ VA EL TIPO DE BASE DE DATOS DE PRODUCCIÓN
    ssl: true, // SSL habilitado para producción
  },
    // Configuración para testing
  test: {
    database: ':memory:', // AQUÍ VA LA BASE DE DATOS EN MEMORIA PARA TESTS
    dialect: 'sqlite', // AQUÍ VA EL TIPO DE BASE DE DATOS PARA TESTS (recomendado SQLite)
  }
};

/**
 * Obtiene la configuración de base de datos según el entorno
 * @returns {Object} Configuración de BD para el entorno actual
 */
export const getDatabaseConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return DB_CONFIG[env];
};

// ===================================================
// ESQUEMAS DE BASE DE DATOS
// ===================================================

/**
 * Esquema de la tabla USUARIOS
 * Define la estructura para almacenar información de usuarios
 */
export const USER_SCHEMA = {
  tableName: 'usuarios',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del usuario'
    },
    email: {
      type: 'VARCHAR(255)',
      unique: true,
      notNull: true,
      comment: 'Correo electrónico del usuario (único)'
    },
    password_hash: {
      type: 'VARCHAR(255)',
      notNull: true,
      comment: 'Contraseña encriptada del usuario'
    },
    nombre: {
      type: 'VARCHAR(100)',
      notNull: true,
      comment: 'Nombre completo del usuario'
    },
    telefono: {
      type: 'VARCHAR(15)',
      comment: 'Teléfono chileno (+56XXXXXXXXX)'
    },
    rol: {
      type: 'ENUM',
      values: ['client', 'admin', 'superadmin'],
      default: 'client',
      comment: 'Rol del usuario en el sistema'
    },
    estado: {
      type: 'ENUM',
      values: ['active', 'inactive', 'suspended'],
      default: 'active',
      comment: 'Estado actual del usuario'
    },
    fecha_registro: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha de registro del usuario'
    },
    ultima_conexion: {
      type: 'TIMESTAMP',
      comment: 'Última vez que el usuario inició sesión'
    },
    created_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creación del registro'
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      comment: 'Fecha de última actualización'
    }
  },
  indexes: [
    { name: 'idx_email', columns: ['email'] },
    { name: 'idx_rol', columns: ['rol'] },
    { name: 'idx_estado', columns: ['estado'] }
  ]
};

/**
 * Esquema de la tabla PRODUCTOS
 * Define la estructura para el catálogo de libros
 */
export const PRODUCT_SCHEMA = {
  tableName: 'productos',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del producto'
    },
    titulo: {
      type: 'VARCHAR(255)',
      notNull: true,
      comment: 'Título del libro'
    },
    autor: {
      type: 'VARCHAR(255)',
      notNull: true,
      comment: 'Autor(es) del libro'
    },
    isbn: {
      type: 'VARCHAR(20)',
      unique: true,
      comment: 'Código ISBN del libro'
    },
    descripcion: {
      type: 'TEXT',
      comment: 'Descripción detallada del libro'
    },
    precio: {
      type: 'DECIMAL(10,2)',
      notNull: true,
      comment: 'Precio en pesos chilenos'
    },
    stock: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
      comment: 'Cantidad disponible en inventario'
    },
    categoria: {
      type: 'VARCHAR(50)',
      notNull: true,
      comment: 'Categoría del libro (ficcion, no-ficcion, etc.)'
    },
    imagen_url: {
      type: 'VARCHAR(500)',
      comment: 'URL de la imagen de portada'
    },
    editorial: {
      type: 'VARCHAR(100)',
      comment: 'Casa editorial'
    },
    año_publicacion: {
      type: 'INTEGER',
      comment: 'Año de publicación'
    },
    paginas: {
      type: 'INTEGER',
      comment: 'Número de páginas'
    },
    idioma: {
      type: 'VARCHAR(20)',
      default: 'español',
      comment: 'Idioma del libro'
    },
    estado: {
      type: 'ENUM',
      values: ['active', 'inactive', 'discontinued'],
      default: 'active',
      comment: 'Estado del producto'
    },
    created_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creación del registro'
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      comment: 'Fecha de última actualización'
    }
  },
  indexes: [
    { name: 'idx_titulo', columns: ['titulo'] },
    { name: 'idx_autor', columns: ['autor'] },
    { name: 'idx_categoria', columns: ['categoria'] },
    { name: 'idx_isbn', columns: ['isbn'] },
    { name: 'idx_precio', columns: ['precio'] },
    { name: 'idx_stock', columns: ['stock'] }
  ]
};

/**
 * Esquema de la tabla PEDIDOS
 * Define la estructura para las órdenes de compra
 */
export const ORDER_SCHEMA = {
  tableName: 'pedidos',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del pedido'
    },
    usuario_id: {
      type: 'INTEGER',
      notNull: true,
      foreignKey: {
        table: 'usuarios',
        column: 'id',
        onDelete: 'CASCADE'
      },
      comment: 'ID del usuario que realizó el pedido'
    },
    numero_pedido: {
      type: 'VARCHAR(20)',
      unique: true,
      notNull: true,
      comment: 'Número único del pedido (ANT-YYYYMMDD-XXXX)'
    },
    total: {
      type: 'DECIMAL(10,2)',
      notNull: true,
      comment: 'Total del pedido en pesos chilenos'
    },
    subtotal: {
      type: 'DECIMAL(10,2)',
      notNull: true,
      comment: 'Subtotal antes de impuestos'
    },
    impuestos: {
      type: 'DECIMAL(10,2)',
      notNull: true,
      comment: 'Monto de IVA (19%)'
    },
    envio: {
      type: 'DECIMAL(10,2)',
      default: 0,
      comment: 'Costo de envío'
    },
    estado: {
      type: 'ENUM',
      values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      comment: 'Estado actual del pedido'
    },
    metodo_pago: {
      type: 'ENUM',
      values: ['webpay', 'transferencia', 'credito', 'debito'],
      comment: 'Método de pago utilizado'
    },
    direccion_envio: {
      type: 'TEXT',
      notNull: true,
      comment: 'Dirección completa de envío'
    },
    notas: {
      type: 'TEXT',
      comment: 'Notas adicionales del pedido'
    },
    fecha_pedido: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha en que se realizó el pedido'
    },
    fecha_envio: {
      type: 'TIMESTAMP',
      comment: 'Fecha en que se envió el pedido'
    },
    fecha_entrega: {
      type: 'TIMESTAMP',
      comment: 'Fecha en que se entregó el pedido'
    },
    created_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creación del registro'
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      comment: 'Fecha de última actualización'
    }
  },
  indexes: [
    { name: 'idx_usuario_id', columns: ['usuario_id'] },
    { name: 'idx_numero_pedido', columns: ['numero_pedido'] },
    { name: 'idx_estado', columns: ['estado'] },
    { name: 'idx_fecha_pedido', columns: ['fecha_pedido'] },
    { name: 'idx_metodo_pago', columns: ['metodo_pago'] }
  ]
};

/**
 * Esquema de la tabla DETALLE_PEDIDOS
 * Define los items individuales de cada pedido
 */
export const ORDER_DETAIL_SCHEMA = {
  tableName: 'detalle_pedidos',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del detalle'
    },
    pedido_id: {
      type: 'INTEGER',
      notNull: true,
      foreignKey: {
        table: 'pedidos',
        column: 'id',
        onDelete: 'CASCADE'
      },
      comment: 'ID del pedido al que pertenece'
    },
    producto_id: {
      type: 'INTEGER',
      notNull: true,
      foreignKey: {
        table: 'productos',
        column: 'id',
        onDelete: 'CASCADE'
      },
      comment: 'ID del producto'
    },
    cantidad: {
      type: 'INTEGER',
      notNull: true,
      comment: 'Cantidad del producto en el pedido'
    },
    precio_unitario: {
      type: 'DECIMAL(10,2)',
      notNull: true,
      comment: 'Precio unitario al momento de la compra'
    },
    subtotal: {
      type: 'DECIMAL(10,2)',
      notNull: true,
      comment: 'Subtotal (cantidad * precio_unitario)'
    },
    created_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creación del registro'
    }
  },
  indexes: [
    { name: 'idx_pedido_id', columns: ['pedido_id'] },
    { name: 'idx_producto_id', columns: ['producto_id'] }
  ]
};

/**
 * Esquema de la tabla SESIONES
 * Gestiona las sesiones activas de usuarios
 */
export const SESSION_SCHEMA = {
  tableName: 'sesiones',
  columns: {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
      comment: 'Token único de sesión'
    },
    usuario_id: {
      type: 'INTEGER',
      notNull: true,
      foreignKey: {
        table: 'usuarios',
        column: 'id',
        onDelete: 'CASCADE'
      },
      comment: 'ID del usuario propietario de la sesión'
    },
    ip_address: {
      type: 'VARCHAR(45)',
      comment: 'Dirección IP del usuario'
    },
    user_agent: {
      type: 'TEXT',
      comment: 'Información del navegador'
    },
    expires_at: {
      type: 'TIMESTAMP',
      notNull: true,
      comment: 'Fecha de expiración de la sesión'
    },
    created_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creación de la sesión'
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      comment: 'Fecha de última actividad'
    }
  },
  indexes: [
    { name: 'idx_usuario_id', columns: ['usuario_id'] },
    { name: 'idx_expires_at', columns: ['expires_at'] }
  ]
};

// ===================================================
// CLASE PRINCIPAL DE GESTIÓN DE BASE DE DATOS
// ===================================================

/**
 * Clase DatabaseManager
 * Maneja todas las operaciones de base de datos del sistema
 */
class DatabaseManager {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.config = getDatabaseConfig();
  }

  /**
   * Establece la conexión con la base de datos
   * @returns {Promise<boolean>} True si la conexión es exitosa
   */
  async connect() {
    try {
      console.log('🔌 Conectando a la base de datos...');
      console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏠 Host: ${this.config.host}`);
      console.log(`🗄️ Base de datos: ${this.config.database}`);
        // TODO: Implementar conexión real según el tipo de BD
      // AQUÍ VAN LAS CONEXIONES REALES A LA BASE DE DATOS:
      
      // Para PostgreSQL:
      // const { Pool } = require('pg');
      // this.connection = new Pool(this.config);
      
      // Para MySQL:
      // const mysql = require('mysql2/promise');
      // this.connection = await mysql.createConnection(this.config);
      
      // Para MongoDB:
      // const { MongoClient } = require('mongodb');
      // const connectionString = `mongodb://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
      // this.connection = await MongoClient.connect(connectionString);
      
      // Por ahora, simulamos la conexión
      this.isConnected = true;
      console.log('✅ Conexión a base de datos establecida exitosamente');
      
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Cierra la conexión con la base de datos
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {      if (this.connection) {
        // TODO: Implementar desconexión según el tipo de BD
        // AQUÍ VAN LAS DESCONEXIONES SEGÚN EL TIPO DE BASE DE DATOS:
        
        // Para PostgreSQL:
        // await this.connection.end();
        
        // Para MySQL:
        // await this.connection.end();
        
        // Para MongoDB:
        // await this.connection.close();
        
        this.connection = null;
        this.isConnected = false;
        console.log('🔌 Desconectado de la base de datos');
      }
    } catch (error) {
      console.error('❌ Error al desconectar de la base de datos:', error);
    }
  }

  /**
   * Verifica si la conexión está activa
   * @returns {boolean} Estado de la conexión
   */
  isConnectionActive() {
    return this.isConnected && this.connection !== null;
  }

  /**
   * Ejecuta una consulta SQL
   * @param {string} query - Consulta SQL a ejecutar
   * @param {Array} params - Parámetros para la consulta
   * @returns {Promise<Object>} Resultado de la consulta
   */
  async executeQuery(query, params = []) {
    try {
      if (!this.isConnectionActive()) {
        throw new Error('No hay conexión activa con la base de datos');
      }

      console.log('🔍 Ejecutando consulta:', query);
      console.log('📋 Parámetros:', params);      // TODO: Implementar ejecución real de consulta
      // AQUÍ VA LA EJECUCIÓN REAL DE CONSULTAS SEGÚN EL TIPO DE BASE DE DATOS:
      
      // Para PostgreSQL:
      // const result = await this.connection.query(query, params);
      
      // Para MySQL:
      // const [rows] = await this.connection.execute(query, params);
      // const result = { rows, rowCount: rows.length, affectedRows: rows.affectedRows };
      
      // Para MongoDB (usar métodos específicos como find, insertOne, etc.):
      // const collection = this.connection.db(this.config.database).collection('nombreColeccion');
      // const result = await collection.find(query).toArray();
      
      // Por ahora, simulamos el resultado
      const result = {
        rows: [],
        rowCount: 0,
        affectedRows: 0
      };

      console.log('✅ Consulta ejecutada exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error al ejecutar consulta:', error);
      throw error;
    }
  }

  /**
   * Inicia una transacción
   * @returns {Promise<void>}
   */
  async beginTransaction() {
    try {
      await this.executeQuery('BEGIN');
      console.log('🔄 Transacción iniciada');
    } catch (error) {
      console.error('❌ Error al iniciar transacción:', error);
      throw error;
    }
  }

  /**
   * Confirma una transacción
   * @returns {Promise<void>}
   */
  async commitTransaction() {
    try {
      await this.executeQuery('COMMIT');
      console.log('✅ Transacción confirmada');
    } catch (error) {
      console.error('❌ Error al confirmar transacción:', error);
      throw error;
    }
  }

  /**
   * Revierte una transacción
   * @returns {Promise<void>}
   */
  async rollbackTransaction() {
    try {
      await this.executeQuery('ROLLBACK');
      console.log('🔄 Transacción revertida');
    } catch (error) {
      console.error('❌ Error al revertir transacción:', error);
      throw error;
    }
  }
}

// ===================================================
// INSTANCIA SINGLETON DEL GESTOR DE BASE DE DATOS
// ===================================================

/**
 * Instancia única del gestor de base de datos
 * Se exporta para uso en toda la aplicación
 */
export const dbManager = new DatabaseManager();

/**
 * Función de utilidad para obtener la conexión
 * @returns {DatabaseManager} Instancia del gestor de BD
 */
export const getDatabase = () => dbManager;

/**
 * Función para inicializar la base de datos
 * Debe llamarse al inicio de la aplicación
 * @returns {Promise<boolean>} True si la inicialización es exitosa
 */
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Inicializando sistema de base de datos...');
    
    const connected = await dbManager.connect();
    if (!connected) {
      throw new Error('No se pudo establecer conexión con la base de datos');
    }    // TODO: Crear tablas si no existen
    // AQUÍ VAN LOS SCRIPTS PARA CREAR LAS TABLAS EN LA BASE DE DATOS:
    // await createTablesIfNotExist();
    
    console.log('🎉 Sistema de base de datos inicializado correctamente');
    return true;
  } catch (error) {
    console.error('💥 Error crítico al inicializar base de datos:', error);
    return false;
  }
};

/**
 * Función para cerrar la base de datos
 * Debe llamarse al cerrar la aplicación
 * @returns {Promise<void>}
 */
export const closeDatabase = async () => {
  try {
    await dbManager.disconnect();
    console.log('👋 Sistema de base de datos cerrado correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar base de datos:', error);
  }
};

// ===================================================
// EXPORTACIONES POR DEFECTO
// ===================================================

export default {
  DatabaseManager,
  dbManager,
  getDatabase,
  initializeDatabase,
  closeDatabase,
  DB_CONFIG,
  getDatabaseConfig,
  USER_SCHEMA,
  PRODUCT_SCHEMA,
  ORDER_SCHEMA,
  ORDER_DETAIL_SCHEMA,
  SESSION_SCHEMA
};
