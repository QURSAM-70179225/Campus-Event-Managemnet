/**
 * API service — every call to the backend goes through here.
 * Adds the JWT token automatically and turns error responses into readable messages.
 */
import { API_URL } from '../config.js';

const TOKEN_KEY = 'campus_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body, query } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let url = `${API_URL}${path}`;
  if (query) {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    if ([...params].length) url += `?${params}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.details?.length ? data.details.join('. ') : data.error;
    const error = new Error(message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/api/login', { method: 'POST', body: { email, password } }),
  signup: (name, email, password) =>
    request('/api/signup', { method: 'POST', body: { name, email, password } }),
  me: () => request('/api/me'),

  // Events
  getEvents: (filters = {}) => request('/api/events', { query: filters }),
  getEvent: (id) => request(`/api/events/${id}`),
  createEvent: (event) => request('/api/events', { method: 'POST', body: event }),
  updateEvent: (id, event) => request(`/api/events/${id}`, { method: 'PUT', body: event }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),

  // Registrations
  registerForEvent: (eventId) => request('/api/register', { method: 'POST', body: { event_id: eventId } }),
  getRegistrations: (filters = {}) => request('/api/registrations', { query: filters }),
  cancelRegistration: (id) => request(`/api/registrations/${id}`, { method: 'DELETE' }),
};
