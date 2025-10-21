/**
 * Formateadores - Funciones para dar formato a datos de visualización
 * Contiene formateos específicos para datos chilenos
 */

/**
 * Formatea precio en pesos chilenos
 * @param {number} price - Precio numérico a formatear
 * @returns {string} Precio formateado (ej: "$15.000")
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0';
  }
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Formatea RUT chileno con puntos y guión
 * @param {string} rut - RUT sin formato (ej: "123456789")
 * @returns {string} RUT formateado (ej: "12.345.678-9")
 */
export const formatRUT = (rut) => {
  // Limpia caracteres no válidos del RUT
  const cleanRut = rut.replace(/[^\dkK]/g, '');
  
  if (cleanRut.length < 2) return rut;
  
  const body = cleanRut.slice(0, -1);      // Números del RUT
  const verifier = cleanRut.slice(-1);     // Dígito verificador
  
  // Agrega puntos cada 3 dígitos desde la derecha
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedBody}-${verifier}`;
};

/**
 * Formatea teléfono chileno con espacios
 * @param {string} phone - Número sin formato
 * @returns {string} Teléfono formateado (ej: "+56 9 1234 5678")
 */
export const formatChileanPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Formatea número completo chileno (569XXXXXXXX)
  if (cleanPhone.length === 11 && cleanPhone.startsWith('569')) {
    return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
  }
  
  return phone;
};

/**
 * Formatea nombre propio con primera letra mayúscula
 * @param {string} name - Nombre a formatear
 * @returns {string} Nombre con formato correcto (ej: "Juan Carlos")
 */
export const formatName = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Trunca texto agregando puntos suspensivos
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {string} Texto truncado con "..." al final
 */
export const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};
