import { apiFetch } from '../client.js';

export async function loginUser(email, password) {
  return apiFetch('/api/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerUser(payload) {
  return apiFetch('/api/register', {
    method: 'POST',
    body: payload,
  });
}

export async function fetchProfile(token) {
  return apiFetch('/api/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
