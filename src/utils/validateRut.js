export function validateRut(rawRut = '') {
  if (typeof rawRut !== 'string') return false;
  const cleanRut = rawRut.replace(/[^\dkK]/g, '').toUpperCase();
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;

  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const mod = 11 - (sum % 11);
  const expectedVerifier = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod);
  return verifier === expectedVerifier;
}

export default validateRut;
