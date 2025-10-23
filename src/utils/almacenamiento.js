/**
 * Almacenamiento - Funciones para manejo de localStorage
 * Proporciona operaciones seguras para guardar datos en el navegador
 */

/**
 * Guarda datos en localStorage de forma segura
 * @param {string} key - Clave para identificar el dato
 * @param {any} value - Valor a guardar (se serializa automáticamente)
 * @returns {boolean} true si se guardó exitosamente
 */
export const setLocalStorage = (key, value) => {
  try {
    if (typeof window === 'undefined') return false;
    
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
    return false;
  }
};

/**
 * Obtiene datos de localStorage de forma segura
 * @param {string} key - Clave del elemento a obtener
 * @param {any} defaultValue - Valor devuelto si la clave no existe
 * @returns {any} Valor almacenado o valor por defecto
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    
    const item = localStorage.getItem(key);
    
    if (item === null) return defaultValue;
    
    return JSON.parse(item);
  } catch (error) {
    console.error('Error obteniendo de localStorage:', error);
    return defaultValue;
  }
};

/**
 * Elimina un elemento específico de localStorage
 * @param {string} key - Clave del elemento a eliminar
 * @returns {boolean} true si se eliminó exitosamente
 */
export const removeLocalStorage = (key) => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
    return false;
  }
};

/**
 * Limpia todo el localStorage
 * @returns {boolean} - true si se limpió exitosamente
 */
export const clearLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
    return false;
  }
};

/**
 * Obtiene todos los elementos del carrito
 * @returns {Array} - Array de productos en el carrito
 */
export const getCartItems = () => {
  return getLocalStorage('cartItems', []);
};

/**
 * Guarda los elementos del carrito
 * @param {Array} items - Array de productos del carrito
 * @returns {boolean} - true si se guardó exitosamente
 */
export const setCartItems = (items) => {
  return setLocalStorage('cartItems', items);
};

/**
 * Agrega un producto al carrito
 * @param {Object} product - Producto a agregar
 * @returns {Array} - Array actualizado del carrito
 */
export const addToCart = (product) => {
  const currentItems = getCartItems();
  const existingItem = currentItems.find(item => item.id === product.id);
  
  let updatedItems;
  
  if (existingItem) {
    updatedItems = currentItems.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedItems = [...currentItems, { ...product, quantity: 1 }];
  }
  
  setCartItems(updatedItems);
  return updatedItems;
};

/**
 * Remueve un producto del carrito
 * @param {string|number} productId - ID del producto a remover
 * @returns {Array} - Array actualizado del carrito
 */
export const removeFromCart = (productId) => {
  const currentItems = getCartItems();
  const updatedItems = currentItems.filter(item => item.id !== productId);
  
  setCartItems(updatedItems);
  return updatedItems;
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {string|number} productId - ID del producto
 * @param {number} quantity - Nueva cantidad
 * @returns {Array} - Array actualizado del carrito
 */
export const updateCartItemQuantity = (productId, quantity) => {
  const currentItems = getCartItems();
  
  if (quantity <= 0) {
    return removeFromCart(productId);
  }
  
  const updatedItems = currentItems.map(item =>
    item.id === productId
      ? { ...item, quantity }
      : item
  );
  
  setCartItems(updatedItems);
  return updatedItems;
};

/**
 * Obtiene el total de productos en el carrito
 * @returns {number} - Cantidad total de productos
 */
export const getCartItemCount = () => {
  const items = getCartItems();
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Obtiene el total del precio del carrito
 * @returns {number} - Precio total del carrito
 */
export const getCartTotal = () => {
  const items = getCartItems();
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
