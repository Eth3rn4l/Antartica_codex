/**
 * Validadores - Funciones para validar datos de formularios
 * Contiene validaciones específicas para formularios chilenos
 */

/**
 * Valida formato de correo electrónico
 * @param {string} email - Correo a validar
 * @returns {boolean} true si el formato es válido
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que las contraseñas coincidan
 * @param {string} password - Contraseña principal
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} true si ambas contraseñas son iguales
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
    return false;
  }
  return password === confirmPassword;
};

/**
 * Valida formato de teléfono chileno
 * Acepta: +56912345678, 56912345678, 912345678
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} true si el formato es válido
 */
export const validateChileanPhone = (phone) => {
  if (typeof phone !== 'string') return false;
  
  // Extrae solo números del teléfono
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Valida formato chileno: 11 dígitos (569XXXXXXXX) o 9 dígitos (9XXXXXXXX)
  if (cleanPhone.length === 11 && cleanPhone.startsWith('569')) {
    return true;
  }
  if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
    return true;
  }
  
  return false;
};

/**
 * Valida RUT chileno usando algoritmo módulo 11
 * @param {string} rut - RUT a validar (acepta formatos: 12345678-5, 12.345.678-5)
 * @returns {boolean} true si el RUT es válido
 */
export const validateRUT = (rut) => {
  if (typeof rut !== 'string') return false;
  
  // Limpia el RUT: elimina puntos, guiones y espacios
  const cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();
  
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;

  const body = cleanRut.slice(0, -1);    // Números del RUT
  const verifier = cleanRut.slice(-1);   // Dígito verificador

  // Aplica algoritmo módulo 11
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  // Calcula dígito verificador esperado
  const mod = 11 - (sum % 11);
  const expectedVerifier = mod === 11 ? '0' : mod === 10 ? 'K' : mod.toString();

  return verifier === expectedVerifier;
};

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} true si el campo tiene contenido
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return Boolean(value);
};

/**
 * Valida longitud mínima de texto
 * @param {string} value - Texto a validar
 * @param {number} minLength - Longitud mínima requerida
 * @returns {boolean} true si cumple la longitud mínima
 */
export const validateMinLength = (value, minLength) => {
  if (typeof value !== 'string') return false;
  return value.length >= minLength;
};
