import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { hashPassword } from '../server/database.js';

describe('server/hashPassword', () => {
  it('returns a SHA-256 hex string of length 64', () => {
    const h = hashPassword('admin123');
    expect(typeof h).toBe('string');
    expect(h).toHaveLength(64);
    // matches node's crypto implementation
    const expected = crypto.createHash('sha256').update('admin123').digest('hex');
    expect(h).toBe(expected);
  });

  it('is deterministic (same input -> same output)', () => {
    expect(hashPassword('foo')).toBe(hashPassword('foo'));
    expect(hashPassword('')).toBe(crypto.createHash('sha256').update('').digest('hex'));
  });
});
