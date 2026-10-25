/**
 * Event model — CRUD for the events table.
 * Every query also returns how many students registered and how many seats are left.
 */
const db = require('../database/db');

const SELECT_WITH_SEATS = `
  SELECT e.*,
         COUNT(r.id)                AS registered,
         e.capacity - COUNT(r.id)   AS seats_available
  FROM events e
  LEFT JOIN registrations r ON r.event_id = e.id
`;

const Event = {
  /**
   * @param {object} filters
   * @param {string} [filters.search]   matches title, description or location
   * @param {string} [filters.category] exact category name
   */
  findAll({ search, category } = {}) {
    const where = [];
    const params = {};

    if (search) {
      where.push('(e.title LIKE @search OR e.description LIKE @search OR e.location LIKE @search)');
      params.search = `%${search}%`;
    }
    if (category) {
      where.push('e.category = @category');
      params.category = category;
    }

    const sql = `${SELECT_WITH_SEATS}
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      GROUP BY e.id
      ORDER BY e.date ASC, e.time ASC`;

    return db.prepare(sql).all(params);
  },

  findById(id) {
    return db.prepare(`${SELECT_WITH_SEATS} WHERE e.id = ? GROUP BY e.id`).get(id);
  },

  create({ title, description, date, time, location, category, capacity, created_by = null }) {
    const result = db
      .prepare(
        `INSERT INTO events (title, description, date, time, location, category, capacity, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(title, description, date, time, location, category, capacity, created_by);
    return Event.findById(result.lastInsertRowid);
  },

  update(id, { title, description, date, time, location, category, capacity }) {
    const result = db
      .prepare(
        `UPDATE events
         SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, capacity = ?
         WHERE id = ?`
      )
      .run(title, description, date, time, location, category, capacity, id);
    return result.changes > 0 ? Event.findById(id) : null;
  },

  remove(id) {
    return db.prepare('DELETE FROM events WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = Event;
