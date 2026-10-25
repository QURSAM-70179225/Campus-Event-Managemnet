/**
 * Registration model — links a student (user) to an event.
 */
const db = require('../database/db');

const SELECT_DETAILS = `
  SELECT r.id, r.user_id, r.event_id, r.registration_date,
         u.name  AS student_name,
         u.email AS student_email,
         e.title AS event_title,
         e.date  AS event_date,
         e.time  AS event_time,
         e.location AS event_location,
         e.category AS event_category
  FROM registrations r
  JOIN users  u ON u.id = r.user_id
  JOIN events e ON e.id = r.event_id
`;

const Registration = {
  create(userId, eventId) {
    const result = db
      .prepare('INSERT INTO registrations (user_id, event_id) VALUES (?, ?)')
      .run(userId, eventId);
    return Registration.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare(`${SELECT_DETAILS} WHERE r.id = ?`).get(id);
  },

  findByUserAndEvent(userId, eventId) {
    return db
      .prepare('SELECT * FROM registrations WHERE user_id = ? AND event_id = ?')
      .get(userId, eventId);
  },

  /** All registrations (admin view), optionally for one event. */
  findAll({ eventId } = {}) {
    if (eventId) {
      return db.prepare(`${SELECT_DETAILS} WHERE r.event_id = ? ORDER BY r.registration_date DESC`).all(eventId);
    }
    return db.prepare(`${SELECT_DETAILS} ORDER BY r.registration_date DESC`).all();
  },

  /** Registrations of a single student. */
  findByUser(userId) {
    return db.prepare(`${SELECT_DETAILS} WHERE r.user_id = ? ORDER BY e.date ASC`).all(userId);
  },

  countForEvent(eventId) {
    return db.prepare('SELECT COUNT(*) AS n FROM registrations WHERE event_id = ?').get(eventId).n;
  },

  remove(id) {
    return db.prepare('DELETE FROM registrations WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = Registration;
