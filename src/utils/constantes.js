/**
 * Constantes de la aplicación Antártica
 * Contiene todas las configuraciones centralizadas del sistema
 */

/**
 * URLs y endpoints de la API
 * Define las rutas principales para comunicación con el backend
 */
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  BOOKS: '/api/books',
  USERS: '/api/users',
  ORDERS: '/api/orders',
  AUTH: '/api/auth'
};

/**
 * Configuración general de la aplicación
 * Contiene metadatos y límites del sistema
 */
export const APP_CONFIG = {
  NAME: 'Antártica',
  VERSION: '1.0.0',
  DESCRIPTION: 'Librería Online - Los mejores libros a tu alcance',
  DEFAULT_PAGE_SIZE: 12, // Número de productos por página
  MAX_CART_ITEMS: 99     // Cantidad máxima por producto en carrito
};

/**
 * Categorías disponibles para libros
 * Claves utilizadas en el sistema de clasificación
 */
export const BOOK_CATEGORIES = {
  FICCION: 'ficcion',
  NO_FICCION: 'no-ficcion',
  INFANTIL: 'infantil',
  JUVENIL: 'juvenil',
  ACADEMICO: 'academico',
  AUTOAYUDA: 'autoayuda',
  BIOGRAFIA: 'biografia',
  HISTORIA: 'historia',
  CIENCIA: 'ciencia',
  ARTE: 'arte'
};

/**
 * Etiquetas legibles para categorías de libros
 * Nombres que se muestran al usuario final
 */
export const CATEGORY_LABELS = {
  [BOOK_CATEGORIES.FICCION]: 'Ficción',
  [BOOK_CATEGORIES.NO_FICCION]: 'No Ficción',
  [BOOK_CATEGORIES.INFANTIL]: 'Infantil',
  [BOOK_CATEGORIES.JUVENIL]: 'Juvenil',
  [BOOK_CATEGORIES.ACADEMICO]: 'Académico',
  [BOOK_CATEGORIES.AUTOAYUDA]: 'Autoayuda',
  [BOOK_CATEGORIES.BIOGRAFIA]: 'Biografía',
  [BOOK_CATEGORIES.HISTORIA]: 'Historia',
  [BOOK_CATEGORIES.CIENCIA]: 'Ciencia',
  [BOOK_CATEGORIES.ARTE]: 'Arte'
};

/**
 * Estados posibles de los pedidos
 * Define el flujo de procesamiento de órdenes
 */
export const ORDER_STATUS = {
  PENDING: 'pending',      // Pendiente de confirmación
  CONFIRMED: 'confirmed',  // Confirmado y en proceso
  SHIPPED: 'shipped',      // Enviado
  DELIVERED: 'delivered',  // Entregado
  CANCELLED: 'cancelled'   // Cancelado
};

/**
 * Etiquetas legibles para estados de pedidos
 * Nombres que se muestran al usuario para cada estado
 */
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.SHIPPED]: 'Enviado',
  [ORDER_STATUS.DELIVERED]: 'Entregado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado'
};

/**
 * Métodos de pago disponibles
 * Opciones de pago que acepta el sistema
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',  // Tarjeta de crédito
  DEBIT_CARD: 'debit_card',    // Tarjeta de débito
  TRANSFER: 'transfer',        // Transferencia bancaria
  CASH: 'cash'                 // Efectivo en entrega
};

/**
 * Etiquetas para métodos de pago
 * Nombres que ve el usuario para cada método
 */
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Tarjeta de Crédito',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Tarjeta de Débito',
  [PAYMENT_METHODS.TRANSFER]: 'Transferencia Bancaria',
  [PAYMENT_METHODS.CASH]: 'Efectivo'
};

/**
 * Regiones de Chile para cálculo de envío
 * Códigos oficiales de las 16 regiones chilenas
 */
export const CHILEAN_REGIONS = {
  ARICA: 'arica-parinacota',
  TARAPACA: 'tarapaca',
  ANTOFAGASTA: 'antofagasta',
  ATACAMA: 'atacama',
  COQUIMBO: 'coquimbo',
  VALPARAISO: 'valparaiso',
  METROPOLITANA: 'metropolitana',
  OHIGGINS: 'ohiggins',
  MAULE: 'maule',
  NUBLE: 'nuble',
  BIOBIO: 'biobio',
  ARAUCANIA: 'araucania',
  LOS_RIOS: 'los-rios',
  LOS_LAGOS: 'los-lagos',
  AYSEN: 'aysen',
  MAGALLANES: 'magallanes'
};

/**
 * Nombres oficiales de las regiones chilenas
 * Para mostrar en formularios y selección de envío
 */
export const REGION_LABELS = {
  [CHILEAN_REGIONS.ARICA]: 'Arica y Parinacota',
  [CHILEAN_REGIONS.TARAPACA]: 'Tarapacá',
  [CHILEAN_REGIONS.ANTOFAGASTA]: 'Antofagasta',
  [CHILEAN_REGIONS.ATACAMA]: 'Atacama',
  [CHILEAN_REGIONS.COQUIMBO]: 'Coquimbo',
  [CHILEAN_REGIONS.VALPARAISO]: 'Valparaíso',
  [CHILEAN_REGIONS.METROPOLITANA]: 'Metropolitana',
  [CHILEAN_REGIONS.OHIGGINS]: 'O\'Higgins',
  [CHILEAN_REGIONS.MAULE]: 'Maule',
  [CHILEAN_REGIONS.NUBLE]: 'Ñuble',
  [CHILEAN_REGIONS.BIOBIO]: 'Biobío',
  [CHILEAN_REGIONS.ARAUCANIA]: 'Araucanía',
  [CHILEAN_REGIONS.LOS_RIOS]: 'Los Ríos',
  [CHILEAN_REGIONS.LOS_LAGOS]: 'Los Lagos',
  [CHILEAN_REGIONS.AYSEN]: 'Aysén',
  [CHILEAN_REGIONS.MAGALLANES]: 'Magallanes'
};

/**
 * Configuración para validación de formularios
 * Define patrones y límites para cada tipo de campo
 */
export const VALIDATION_CONFIG = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,            // Mínimo 8 caracteres
    MAX_LENGTH: 128,          // Máximo 128 caracteres
    REQUIRE_UPPERCASE: true,  // Requiere mayúscula
    REQUIRE_LOWERCASE: true,  // Requiere minúscula
    REQUIRE_NUMBER: true,     // Requiere número
    REQUIRE_SPECIAL: false    // No requiere carácter especial
  },
  NAME: {
    MIN_LENGTH: 2,            // Mínimo 2 caracteres para nombres
    MAX_LENGTH: 50            // Máximo 50 caracteres
  },
  PHONE: {
    PATTERN: /^(\+56)?[9][0-9]{8}$/  // Formato chileno: +56912345678
  },
  RUT: {
    PATTERN: /^[0-9]+[-|‐]{1}[0-9kK]{1}$/  // Formato RUT chileno
  }
};

/**
 * Mensajes de error estandarizados
 * Textos que se muestran al usuario en validaciones
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Ingresa un email válido',
  INVALID_PHONE: 'Ingresa un teléfono válido (formato: +56912345678)',
  INVALID_RUT: 'Ingresa un RUT válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORDS_NO_MATCH: 'Las contraseñas no coinciden',
  GENERIC_ERROR: 'Ha ocurrido un error. Intenta nuevamente.'
};

/**
 * Claves utilizadas en localStorage
 * Evita errores de tipeo en nombres de storage
 */
export const STORAGE_KEYS = {
  CART_ITEMS: 'cartItems',           // Productos en el carrito
  USER_PREFERENCES: 'userPreferences', // Preferencias del usuario
  SEARCH_HISTORY: 'searchHistory',   // Historial de búsquedas
  USER_SESSION: 'userSession'        // Datos de sesión activa
};

/**
 * Configuración de interfaz de usuario
 * Tiempos y delays para mejorar la experiencia
 */
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,      // Delay para búsquedas automáticas (ms)
  ANIMATION_DURATION: 200,  // Duración de animaciones (ms)
  TOAST_DURATION: 3000,     // Tiempo de notificaciones (ms)
  LOADING_MIN_TIME: 500     // Tiempo mínimo de loading (ms)
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  HELP: '/ayuda',
  CONTACT: '/contact',
  ABOUT: '/sobre-nosotros',
  BOOK_DETAIL: '/libro/:id',
  CATEGORY: '/categoria/:category',
  SEARCH: '/buscar'
};
