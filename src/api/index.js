/**
 * Central API helper — attaches Bearer token automatically.
 * Usage: apiFetch('/api/products', { method: 'GET' })
 */
const BASE = '';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('vs_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}
