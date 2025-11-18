export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function buildHeaders(baseHeaders = {}, body) {
  const headers = { ...baseHeaders };
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  return headers;
}

export async function apiFetch(path, options = {}) {
  const { body, headers: customHeaders, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: buildHeaders(customHeaders, body),
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Error en la solicitud';
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
