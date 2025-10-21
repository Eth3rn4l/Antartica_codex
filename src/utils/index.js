/**
 * Exportaciones centralizadas de utilidades
 * Permite importar todas las funciones desde un solo lugar
 */

// Validadores - funciones para validar datos de formularios
export {
  validateEmail,
  validateRUT,
  validateChileanPhone,
  validatePasswordMatch,
  validateRequired,
  validateMinLength
} from './validadores.js';

// Formateadores - funciones para formatear datos de visualización
export {
  formatPrice,
  formatRUT,
  formatChileanPhone,
  formatName,
  truncateText
} from './formateadores.js';

// Almacenamiento - funciones para manejo de localStorage
export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  getCartItems,
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartItemCount,
  getCartTotal
} from './almacenamiento.js';

// Constantes - valores fijos usados en toda la aplicación
export {
  API_ENDPOINTS,
  APP_CONFIG,
  BOOK_CATEGORIES,
  CATEGORY_LABELS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  CHILEAN_REGIONS,
  REGION_LABELS,
  VALIDATION_CONFIG,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  UI_CONFIG,
  ROUTES
} from './constantes.js';
