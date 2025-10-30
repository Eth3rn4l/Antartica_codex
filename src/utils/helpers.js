export function add(a, b) {
  return a + b;
}

export function capitalize(str) {
  if (typeof str !== 'string') return '';
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  // simple email regex for basic validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidRut(rut) {
  if (typeof rut !== 'string') return false;
  const cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;

  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const mod = 11 - (sum % 11);
  const expectedVerifier = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod);

  return verifier === expectedVerifier;
}
