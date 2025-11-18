export function validateCardNumber(cardNumber = '') {
  const sanitized = String(cardNumber).replace(/\D/g, '');
  if (sanitized.length < 12) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(sanitized[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default validateCardNumber;
