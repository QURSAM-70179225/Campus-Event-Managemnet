// Shared front-end configuration

// Backend URL — set VITE_API_URL in frontend/.env (see .env.example)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const UNIVERSITY_NAME = 'The University of Lahore';

export const CATEGORIES = ['Seminar', 'Workshop', 'Sports', 'Competition', 'Conference', 'Society'];
