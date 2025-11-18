import { apiFetch } from '../client.js';

export async function getBooks(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiFetch(`/api/books${suffix}`);
}

export async function createBook(payload, token) {
  return apiFetch('/api/books', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });
}

export async function updateBook(id, payload, token) {
  return apiFetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });
}

export async function deleteBook(id, token) {
  return apiFetch(`/api/books/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
