/**
 * Database connection (SQLite via better-sqlite3).
 * Creates the database file and tables automatically on first run.
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'campus_events.db');

const db = new Database(dbPath);

// Enforce foreign keys (off by default in SQLite)
db.pragma('foreign_keys = ON');
if (dbPath !== ':memory:') {
  db.pragma('journal_mode = WAL');
}

// Create tables if they do not exist yet
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
