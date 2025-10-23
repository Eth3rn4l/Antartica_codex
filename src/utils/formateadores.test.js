import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatRUT,
  formatChileanPhone,
  formatName,
  truncateText
} from '../utils/formateadores.js';

describe('Formatters', () => {
  describe('formatPrice', () => {
    it('debe formatear precios correctamente', () => {
      expect(formatPrice(15000)).toBe('$15.000');
      expect(formatPrice(1500)).toBe('$1.500');
      expect(formatPrice(150000)).toBe('$150.000');
      expect(formatPrice(0)).toBe('$0');
    });

    it('debe manejar números decimales', () => {
      expect(formatPrice(15000.99)).toBe('$15.001');
      expect(formatPrice(1500.45)).toBe('$1.500');
    });

    it('debe manejar valores inválidos', () => {
      expect(formatPrice(null)).toBe('$0');
      expect(formatPrice(undefined)).toBe('$0');
      expect(formatPrice('abc')).toBe('$0');
      expect(formatPrice(NaN)).toBe('$0');
    });
  });

  describe('formatRUT', () => {
    it('debe formatear RUTs correctamente', () => {
      expect(formatRUT('123456789')).toBe('12.345.678-9');
      expect(formatRUT('12345678K')).toBe('12.345.678-K');
      expect(formatRUT('1234567')).toBe('123.456-7');
    });

    it('debe mantener RUTs ya formateados', () => {
      expect(formatRUT('12.345.678-9')).toBe('12.345.678-9');
    });

    it('debe manejar RUTs cortos', () => {
      expect(formatRUT('123')).toBe('12-3');
      expect(formatRUT('12')).toBe('1-2');
      expect(formatRUT('1')).toBe('1');
    });

    it('debe limpiar caracteres no válidos', () => {
      expect(formatRUT('12.345.678-9abc')).toBe('12.345.678-9');
      expect(formatRUT('abc12345678def9')).toBe('12.345.678-9');
    });
  });

  describe('formatChileanPhone', () => {
    it('debe formatear teléfonos chilenos correctamente', () => {
      expect(formatChileanPhone('56912345678')).toBe('+56 9 1234 5678');
    });

    it('debe mantener formato si no es teléfono chileno válido', () => {
      expect(formatChileanPhone('123456789')).toBe('123456789');
      expect(formatChileanPhone('56812345678')).toBe('56812345678');
      expect(formatChileanPhone('+1234567890')).toBe('+1234567890');
    });

    it('debe limpiar caracteres no numéricos antes de formatear', () => {
      expect(formatChileanPhone('569-1234-5678')).toBe('+56 9 1234 5678');
      expect(formatChileanPhone('569 1234 5678')).toBe('+56 9 1234 5678');
    });
  });

  describe('formatName', () => {
    it('debe formatear nombres correctamente', () => {
      expect(formatName('juan perez')).toBe('Juan Perez');
      expect(formatName('MARIA GONZALEZ')).toBe('Maria Gonzalez');
      expect(formatName('ana MARIA del CARMEN')).toBe('Ana Maria Del Carmen');
    });

    it('debe manejar un solo nombre', () => {
      expect(formatName('carlos')).toBe('Carlos');
      expect(formatName('ANA')).toBe('Ana');
    });

    it('debe manejar valores inválidos', () => {
      expect(formatName('')).toBe('');
      expect(formatName(null)).toBe('');
      expect(formatName(undefined)).toBe('');
      expect(formatName(123)).toBe('');
    });

    it('debe manejar espacios múltiples', () => {
      expect(formatName('juan  perez')).toBe('Juan  Perez');
      expect(formatName(' carlos ')).toBe(' Carlos ');
    });
  });

  describe('truncateText', () => {
    it('debe truncar texto largo correctamente', () => {
      const longText = 'Este es un texto muy largo que debe ser truncado';
      expect(truncateText(longText, 20)).toBe('Este es un texto muy...');
      expect(truncateText(longText, 10)).toBe('Este es un...');
    });

    it('debe mantener texto corto sin cambios', () => {
      expect(truncateText('Texto corto', 20)).toBe('Texto corto');
      expect(truncateText('Hola', 10)).toBe('Hola');
    });

    it('debe manejar texto exactamente de la longitud máxima', () => {
      expect(truncateText('1234567890', 10)).toBe('1234567890');
    });

    it('debe manejar valores inválidos', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText(null, 10)).toBe('');
      expect(truncateText(undefined, 10)).toBe('');
      expect(truncateText(123, 10)).toBe('');
    });

    it('debe remover espacios al final antes de agregar puntos', () => {
      expect(truncateText('Texto con espacios   ', 10)).toBe('Texto con...');
    });
  });
});
