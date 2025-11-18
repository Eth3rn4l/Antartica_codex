import { apiFetch } from '../client.js';

export async function fetchCart(token) {
  return apiFetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
}

export async function addToCart(bookId, quantity, token) {
  return apiFetch('/api/cart', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { book_id: bookId, quantity },
  });
}

export async function removeFromCart(cartItemId, token) {
  return apiFetch(`/api/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function checkoutCart(token) {
  return apiFetch('/api/cart/checkout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
