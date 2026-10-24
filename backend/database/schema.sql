-- Campus Event Management System - database schema (SQLite)
-- Tables: users, events, registrations

CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE,
  password    TEXT    NOT NULL,              -- bcrypt hash, never plain text
  role        TEXT    NOT NULL DEFAULT 'student'
                      CHECK (role IN ('student', 'admin')),
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL,
  description  TEXT    NOT NULL,
  date         TEXT    NOT NULL,             -- YYYY-MM-DD
  time         TEXT    NOT NULL,             -- HH:MM (24h)
  location     TEXT    NOT NULL,
  category     TEXT    NOT NULL
                       CHECK (category IN ('Seminar', 'Workshop', 'Sports',
                                           'Competition', 'Conference', 'Society')),
  capacity     INTEGER NOT NULL CHECK (capacity > 0),
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id            INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  event_id           INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registration_date  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, event_id)                 -- a student can register only once per event
);

CREATE INDEX IF NOT EXISTS idx_events_category       ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date           ON events(date);
CREATE INDEX IF NOT EXISTS idx_registrations_event   ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user    ON registrations(user_id);
