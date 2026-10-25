/**
 * Request validation middleware.
 * Each validator checks req.body and responds with 400 + a list of problems,
 * or calls next() when the data is valid.
 */

const CATEGORIES = ['Seminar', 'Workshop', 'Sports', 'Competition', 'Conference', 'Society'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

function reject(res, details) {
  return res.status(400).json({ error: 'Validation failed', details });
}

function validateSignup(req, res, next) {
  const { name, email, password } = req.body || {};
  const details = [];

  if (isBlank(name) || String(name).trim().length < 3) details.push('Name must be at least 3 characters');
  if (isBlank(email) || !EMAIL_RE.test(String(email).trim())) details.push('A valid email is required');
  if (isBlank(password) || String(password).length < 6) details.push('Password must be at least 6 characters');

  if (details.length) return reject(res, details);

  req.body.name = String(name).trim();
  req.body.email = String(email).trim().toLowerCase();
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const details = [];

  if (isBlank(email)) details.push('Email is required');
  if (isBlank(password)) details.push('Password is required');

  if (details.length) return reject(res, details);

  req.body.email = String(email).trim().toLowerCase();
  next();
}

function validateEvent(req, res, next) {
  const { title, description, date, time, location, category, capacity } = req.body || {};
  const details = [];

  if (isBlank(title) || String(title).trim().length < 3) details.push('Title must be at least 3 characters');
  if (isBlank(description)) details.push('Description is required');
  if (isBlank(date) || !DATE_RE.test(date) || Number.isNaN(Date.parse(date))) details.push('Date must be in YYYY-MM-DD format');
  if (isBlank(time) || !TIME_RE.test(time)) details.push('Time must be in HH:MM (24-hour) format');
  if (isBlank(location)) details.push('Location is required');
  if (!CATEGORIES.includes(category)) details.push(`Category must be one of: ${CATEGORIES.join(', ')}`);

  const cap = Number(capacity);
  if (!Number.isInteger(cap) || cap < 1) details.push('Capacity must be a whole number greater than 0');

  if (details.length) return reject(res, details);

  req.body = {
    title: String(title).trim(),
    description: String(description).trim(),
    date,
    time,
    location: String(location).trim(),
    category,
    capacity: cap,
  };
  next();
}

function validateRegistration(req, res, next) {
  const eventId = Number(req.body && req.body.event_id);
  if (!Number.isInteger(eventId) || eventId < 1) {
    return reject(res, ['event_id must be a valid event id']);
  }
  req.body.event_id = eventId;
  next();
}

/** Ensures :id route parameters are positive integers. */
function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id parameter' });
  }
  req.params.id = id;
  next();
}

module.exports = {
  CATEGORIES,
  validateSignup,
  validateLogin,
  validateEvent,
  validateRegistration,
  validateIdParam,
};
