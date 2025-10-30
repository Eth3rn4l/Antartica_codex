import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidRut } from '../src/utils/helpers.js';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@sub.domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isValidRut', () => {
  it('validates common RUT formats (with or without dots, lowercase k)', () => {
    expect(isValidRut('20.142.499-2')).toBe(true);
    expect(isValidRut('20142499-2')).toBe(true);
    expect(isValidRut('88.679.500-9')).toBe(true);
    expect(isValidRut('88679500-9')).toBe(true);
    expect(isValidRut('13.433.197-6')).toBe(true);
    // lowercase k
    expect(isValidRut('12.345.678-k')).toBe(false); // example invalid
  });

  it('rejects invalid RUTs and invalid input types', () => {
    expect(isValidRut('12345678-9')).toBe(false);
    expect(isValidRut('abcdef')).toBe(false);
    expect(isValidRut('')).toBe(false);
    expect(isValidRut(null)).toBe(false);
  });
});
