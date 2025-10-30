import { describe, it, expect } from 'vitest';
import { add, capitalize, isValidEmail } from '../src/utils/helpers.js';

describe('helpers - add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
  });
});

describe('helpers - capitalize', () => {
  it('capitalizes a word', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('')).toBe('');
  });

  it('returns empty string for non-strings', () => {
    expect(capitalize(null)).toBe('');
    expect(capitalize(123)).toBe('');
  });
});

describe('helpers - isValidEmail', () => {
  it('validates basic emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('another@test.co.uk')).toBe(true);
  });

  it('returns false for non-strings', () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
  });
});
