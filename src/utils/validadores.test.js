import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateRUT,
  validateChileanPhone,
  validatePasswordMatch,
  validateRequired,
  validateMinLength
} from '../utils/validadores.js';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('debe validar emails correctos', () => {
      expect(validateEmail('usuario@gmail.com')).toBe(true);
      expect(validateEmail('test.email@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('debe rechazar emails inválidos', () => {
      expect(validateEmail('email-invalido')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('usuario@')).toBe(false);
      expect(validateEmail('usuario@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('debe manejar valores no string', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(123)).toBe(false);
    });
  });

  describe('validateRUT', () => {
    it('debe validar RUTs chilenos correctos', () => {
      expect(validateRUT('11111111-1')).toBe(true);
      expect(validateRUT('11.111.111-1')).toBe(true);
      expect(validateRUT('12345678-5')).toBe(true);
      expect(validateRUT('1234567-4')).toBe(true);
    });

    it('debe rechazar RUTs inválidos', () => {
      expect(validateRUT('12345678-0')).toBe(false);
      expect(validateRUT('12345678-X')).toBe(false);
      expect(validateRUT('123456')).toBe(false);
      expect(validateRUT('')).toBe(false);
      expect(validateRUT('abc-def')).toBe(false);
    });

    it('debe manejar valores no string', () => {
      expect(validateRUT(null)).toBe(false);
      expect(validateRUT(undefined)).toBe(false);
      expect(validateRUT(123456789)).toBe(false);
    });
  });

  describe('validateChileanPhone', () => {
    it('debe validar teléfonos chilenos correctos', () => {
      expect(validateChileanPhone('+56912345678')).toBe(true);
      expect(validateChileanPhone('56912345678')).toBe(true);
      expect(validateChileanPhone('912345678')).toBe(true);
    });

    it('debe rechazar teléfonos inválidos', () => {
      expect(validateChileanPhone('812345678')).toBe(false); // No empieza con 9
      expect(validateChileanPhone('+5691234567')).toBe(false); // Muy corto
      expect(validateChileanPhone('+569123456789')).toBe(false); // Muy largo
      expect(validateChileanPhone('abcdefghij')).toBe(false);
      expect(validateChileanPhone('')).toBe(false);
    });

    it('debe manejar valores no string', () => {
      expect(validateChileanPhone(null)).toBe(false);
      expect(validateChileanPhone(undefined)).toBe(false);
      expect(validateChileanPhone(912345678)).toBe(false);
    });
  });

  describe('validatePasswordMatch', () => {
    it('debe validar contraseñas coincidentes', () => {
      expect(validatePasswordMatch('password123', 'password123')).toBe(true);
      expect(validatePasswordMatch('', '')).toBe(true);
      expect(validatePasswordMatch('abc', 'abc')).toBe(true);
    });

    it('debe rechazar contraseñas que no coinciden', () => {
      expect(validatePasswordMatch('password123', 'password456')).toBe(false);
      expect(validatePasswordMatch('password', 'Password')).toBe(false);
      expect(validatePasswordMatch('abc', 'abcd')).toBe(false);
    });

    it('debe manejar valores no string', () => {
      expect(validatePasswordMatch(null, null)).toBe(false);
      expect(validatePasswordMatch(undefined, undefined)).toBe(false);
      expect(validatePasswordMatch('password', null)).toBe(false);
      expect(validatePasswordMatch(123, 123)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('debe validar valores requeridos', () => {
      expect(validateRequired('texto')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('123')).toBe(true);
      expect(validateRequired(true)).toBe(true);
      expect(validateRequired(1)).toBe(true);
    });

    it('debe rechazar valores vacíos o inválidos', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false); // Solo espacios
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
      expect(validateRequired(0)).toBe(false);
      expect(validateRequired(false)).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('debe validar longitud mínima correcta', () => {
      expect(validateMinLength('password', 8)).toBe(true);
      expect(validateMinLength('password123', 8)).toBe(true);
      expect(validateMinLength('abc', 3)).toBe(true);
    });

    it('debe rechazar texto menor a la longitud mínima', () => {
      expect(validateMinLength('pass', 8)).toBe(false);
      expect(validateMinLength('ab', 3)).toBe(false);
      expect(validateMinLength('', 1)).toBe(false);
    });

    it('debe manejar valores no string', () => {
      expect(validateMinLength(null, 5)).toBe(false);
      expect(validateMinLength(undefined, 5)).toBe(false);
      expect(validateMinLength(123, 5)).toBe(false);
    });

    it('debe manejar longitud mínima inválida', () => {
      expect(validateMinLength('texto', -1)).toBe(true); // Longitud negativa
      expect(validateMinLength('texto', 0)).toBe(true); // Longitud cero
    });
  });
});
