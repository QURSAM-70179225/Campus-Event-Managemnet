/**
 * User model — all SQL for the users table lives here.
 */
const db = require('../database/db');

const PUBLIC_FIELDS = 'id, name, email, role, created_at';

const User = {
  create({ name, email, password, role = 'student' }) {
    const result = db
      .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email, password, role);
    return User.findById(result.lastInsertRowid);
  },

  /** Includes the password hash — only use for login checks. */
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(id);
  },

  findAll() {
    return db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users ORDER BY id`).all();
  },

  remove(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = User;
