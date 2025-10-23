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

/**
 * Valida si un email corresponde a un administrador
 * @param {string} email - Email a verificar
 * @returns {boolean} true si es email de administrador
 */
export const validateAdmin = (email) => {
  if (!validateEmail(email)) return false;
  
  // Importar constantes de administradores
  const adminEmails = [
    'admin@antartica.cl',
    'administrador@antartica.cl', 
    'gerente@antartica.cl'
  ];
  
  return adminEmails.includes(email.toLowerCase());
};

/**
 * Valida credenciales de administrador
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {object} { isValid: boolean, isAdmin: boolean, message: string }
 */
export const validateAdminCredentials = (email, password) => {
  // Validaciones básicas
  if (!validateRequired(email) || !validateRequired(password)) {
    return {
      isValid: false,
      isAdmin: false,
      message: 'Email y contraseña son requeridos'
    };
  }

  if (!validateEmail(email)) {
    return {
      isValid: false,
      isAdmin: false,
      message: 'Formato de email inválido'
    };
  }

  // Verificar si es administrador
  const isAdmin = validateAdmin(email);
  
  // Por simplicidad, usar contraseñas predefinidas para admins
  const adminCredentials = {
    'admin@antartica.cl': 'admin123',
    'administrador@antartica.cl': 'admin456',
    'gerente@antartica.cl': 'gerente789'
  };

  if (isAdmin) {
    const correctPassword = adminCredentials[email.toLowerCase()];
    if (password === correctPassword) {
      return {
        isValid: true,
        isAdmin: true,
        message: 'Login de administrador exitoso'
      };
    } else {
      return {
        isValid: false,
        isAdmin: true,
        message: 'Contraseña de administrador incorrecta'
      };
    }
  }

  // Para usuarios normales, aceptar cualquier contraseña válida (simulación)
  if (validateMinLength(password, 6)) {
    return {
      isValid: true,
      isAdmin: false,
      message: 'Login de cliente exitoso'
    };
  }

  return {
    isValid: false,
    isAdmin: false,
    message: 'Contraseña debe tener al menos 6 caracteres'
  };
};
