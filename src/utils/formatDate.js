export function formatDate(dateValue, locale = 'es-CL', options = {}) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const baseOptions = { year: 'numeric', month: 'long', day: 'numeric', ...options };
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, baseOptions).format(date);
}

export default formatDate;
