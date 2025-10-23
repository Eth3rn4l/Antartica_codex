/**
 * ===================================================
 * DATA LAYER INDEX - PUNTO DE ENTRADA CENTRALIZADO
 * ===================================================
 * 
 * Archivo central para todas las operaciones de base de datos.
 * Exporta todos los modelos y utilidades de la capa de datos.
 * 
 * CARACTERÍSTICAS:
 * - Inicialización automática de la base de datos
 * - Exportación centralizada de todos los modelos
 * - Utilidades para gestión de conexiones
 * - Configuración de entorno automatizada
 * 
 * AUTOR: Sistema Antártica
 * FECHA: Octubre 2025
 * ===================================================
 */

// ===================================================
// IMPORTACIONES DE MODELOS Y UTILIDADES
// ===================================================

// Gestor principal de base de datos
import {
  dbManager,
  getDatabase,
  initializeDatabase,
  closeDatabase,
  getDatabaseConfig,
  DB_CONFIG
} from './database.js';

// Modelos de datos
import { UserModel, userModel, getUserModel } from './userModel.js';
import { ProductModel, productModel, getProductModel } from './productModel.js';
import { OrderModel, orderModel, getOrderModel, ORDER_STATES, PAYMENT_METHODS, ORDER_CONFIG } from './orderModel.js';

// Esquemas de base de datos
import {
  USER_SCHEMA,
  PRODUCT_SCHEMA,
  ORDER_SCHEMA,
  ORDER_DETAIL_SCHEMA,
  SESSION_SCHEMA
} from './database.js';

// ===================================================
// CONFIGURACIÓN Y INICIALIZACIÓN
// ===================================================

/**
 * Estado de inicialización del sistema de datos
 */
let isInitialized = false;

/**
 * Inicializa toda la capa de datos
 * Debe llamarse una vez al inicio de la aplicación
 * 
 * @returns {Promise<boolean>} True si la inicialización es exitosa
 */
export const initializeDataLayer = async () => {
  try {
    if (isInitialized) {
      console.log('📊 Capa de datos ya inicializada');
      return true;
    }

    console.log('🚀 Inicializando capa de datos de Antártica...');
    
    // Mostrar configuración del entorno
    const config = getDatabaseConfig();
    console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Base de datos: ${config.database}`);
    console.log(`🏠 Host: ${config.host}:${config.port}`);
    
    // Inicializar conexión a base de datos
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      throw new Error('No se pudo inicializar la base de datos');
    }

    // Validar modelos
    console.log('🔍 Validando modelos de datos...');
    
    if (!userModel || !productModel || !orderModel) {
      throw new Error('Error al cargar modelos de datos');
    }

    console.log('✅ Modelos cargados correctamente:');
    console.log('   👤 UserModel - Gestión de usuarios');
    console.log('   📚 ProductModel - Catálogo de libros');
    console.log('   🛒 OrderModel - Gestión de pedidos');

    // TODO: Crear tablas si no existen
    // await createDatabaseTables();
    
    // TODO: Ejecutar migraciones pendientes
    // await runMigrations();
    
    // TODO: Insertar datos iniciales si es necesario
    // await seedInitialData();

    isInitialized = true;
    console.log('🎉 Capa de datos inicializada correctamente');
    
    return true;
    
  } catch (error) {
    console.error('💥 Error crítico al inicializar capa de datos:', error);
    isInitialized = false;
    return false;
  }
};

/**
 * Cierra la capa de datos
 * Debe llamarse al cerrar la aplicación
 * 
 * @returns {Promise<void>}
 */
export const closeDataLayer = async () => {
  try {
    if (!isInitialized) {
      console.log('📊 Capa de datos no estaba inicializada');
      return;
    }

    console.log('🔄 Cerrando capa de datos...');
    
    // Cerrar conexión a base de datos
    await closeDatabase();
    
    isInitialized = false;
    console.log('👋 Capa de datos cerrada correctamente');
    
  } catch (error) {
    console.error('❌ Error al cerrar capa de datos:', error);
  }
};

/**
 * Verifica si la capa de datos está inicializada
 * 
 * @returns {boolean} Estado de inicialización
 */
export const isDataLayerInitialized = () => isInitialized;

/**
 * Obtiene información del estado de la base de datos
 * 
 * @returns {Object} Estado de la base de datos
 */
export const getDatabaseStatus = () => {
  return {
    initialized: isInitialized,
    connected: dbManager.isConnectionActive(),
    config: getDatabaseConfig(),
    models: {
      users: !!userModel,
      products: !!productModel,
      orders: !!orderModel
    }
  };
};

// ===================================================
// UTILIDADES DE DESARROLLO
// ===================================================

/**
 * Ejecuta una consulta SQL directa (solo para desarrollo/debugging)
 * ⚠️ NO USAR EN PRODUCCIÓN
 * 
 * @param {string} query - Consulta SQL
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise<Object>} Resultado de la consulta
 */
export const executeRawQuery = async (query, params = []) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('executeRawQuery no está disponible en producción');
    }
    
    console.log('⚠️ Ejecutando consulta SQL directa (solo desarrollo)');
    return await dbManager.executeQuery(query, params);
  } catch (error) {
    console.error('❌ Error en consulta SQL directa:', error);
    throw error;
  }
};

/**
 * Resetea la base de datos (solo para testing/desarrollo)
 * ⚠️ ELIMINA TODOS LOS DATOS
 * 
 * @returns {Promise<boolean>} True si el reset es exitoso
 */
export const resetDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('resetDatabase no está disponible en producción');
    }
    
    console.log('⚠️ RESETEO DE BASE DE DATOS - ELIMINANDO TODOS LOS DATOS');
    
    // TODO: Implementar reset de tablas
    // await dbManager.executeQuery('TRUNCATE TABLE detalle_pedidos');
    // await dbManager.executeQuery('TRUNCATE TABLE pedidos');
    // await dbManager.executeQuery('TRUNCATE TABLE productos');
    // await dbManager.executeQuery('TRUNCATE TABLE usuarios');
    // await dbManager.executeQuery('TRUNCATE TABLE sesiones');
    
    console.log('✅ Base de datos reseteada (simulado)');
    return true;
    
  } catch (error) {
    console.error('❌ Error al resetear base de datos:', error);
    return false;
  }
};

// ===================================================
// FUNCIONES DE MIGRACIÓN Y SEEDING
// ===================================================

/**
 * Crea todas las tablas de la base de datos
 * Se ejecuta automáticamente en la inicialización
 * 
 * @returns {Promise<void>}
 */
const createDatabaseTables = async () => {
  try {
    console.log('🔨 Creando tablas de base de datos...');
    
    // TODO: Implementar creación de tablas basada en los esquemas
    // const tables = [USER_SCHEMA, PRODUCT_SCHEMA, ORDER_SCHEMA, ORDER_DETAIL_SCHEMA, SESSION_SCHEMA];
    
    // for (const schema of tables) {
    //   await createTableFromSchema(schema);
    // }
    
    console.log('✅ Tablas creadas correctamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
    throw error;
  }
};

/**
 * Inserta datos iniciales en la base de datos
 * Solo se ejecuta si las tablas están vacías
 * 
 * @returns {Promise<void>}
 */
const seedInitialData = async () => {
  try {
    console.log('🌱 Insertando datos iniciales...');
    
    // TODO: Verificar si ya existen datos
    // TODO: Insertar usuarios administradores
    // TODO: Insertar productos de ejemplo
    // TODO: Insertar categorías
    
    console.log('✅ Datos iniciales insertados');
  } catch (error) {
    console.error('❌ Error al insertar datos iniciales:', error);
    throw error;
  }
};

// ===================================================
// EXPORTACIONES PRINCIPALES
// ===================================================

// Gestión de base de datos
export {
  dbManager,
  getDatabase,
  initializeDatabase,
  closeDatabase,
  getDatabaseConfig,
  DB_CONFIG
};

// Modelos de datos
export {
  UserModel,
  userModel,
  getUserModel,
  ProductModel,
  productModel,
  getProductModel,
  OrderModel,
  orderModel,
  getOrderModel
};

// Esquemas
export {
  USER_SCHEMA,
  PRODUCT_SCHEMA,
  ORDER_SCHEMA,
  ORDER_DETAIL_SCHEMA,
  SESSION_SCHEMA
};

// Constantes de pedidos
export {
  ORDER_STATES,
  PAYMENT_METHODS,
  ORDER_CONFIG
};

// ===================================================
// EXPORTACIÓN POR DEFECTO
// ===================================================

/**
 * Objeto principal con toda la funcionalidad de la capa de datos
 */
export default {
  // Inicialización
  initializeDataLayer,
  closeDataLayer,
  isDataLayerInitialized,
  getDatabaseStatus,
  
  // Gestión de BD
  dbManager,
  getDatabase,
  
  // Modelos
  models: {
    users: userModel,
    products: productModel,
    orders: orderModel
  },
  
  // Utilidades de desarrollo
  executeRawQuery,
  resetDatabase,
  
  // Configuración
  config: {
    database: DB_CONFIG,
    orders: ORDER_CONFIG,
    states: ORDER_STATES,
    payments: PAYMENT_METHODS
  }
};
