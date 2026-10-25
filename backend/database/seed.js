/**
 * Seed data: one admin, one student and sample events.
 *
 *   npm run seed            -> seeds only if the database is empty
 *   npm run seed -- --reset -> deletes all data and seeds again
 *
 * The server also calls seedDatabase() on start-up when the events table is empty.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

// Dates are generated relative to today so the sample events are always "upcoming"
function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const sampleEvents = [
  {
    title: 'AI Workshop: Building Apps with Large Language Models',
    description:
      'Hands-on workshop on using LLM APIs to build smart web apps. Bring your laptop — we will build a small chatbot from scratch and deploy it.',
    date: daysFromNow(5), time: '10:00', location: 'CS Lab 3, Main Campus',
    category: 'Workshop', capacity: 40,
  },
  {
    title: 'Seminar on Cyber Security Careers',
    description:
      'Industry experts talk about careers in cyber security, certifications that matter, and how students can start with CTF competitions.',
    date: daysFromNow(8), time: '11:30', location: 'Main Auditorium',
    category: 'Seminar', capacity: 200,
  },
  {
    title: 'Inter-Department Cricket Tournament',
    description:
      'Annual T10 cricket tournament between departments. Register as a player or join as a supporter. Kits will be provided to teams.',
    date: daysFromNow(12), time: '14:00', location: 'University Sports Ground',
    category: 'Sports', capacity: 120,
  },
  {
    title: 'Code Sprint Programming Competition',
    description:
      'A 3-hour competitive programming contest. Solve algorithmic problems individually. Prizes for the top three participants.',
    date: daysFromNow(15), time: '09:00', location: 'Computer Lab Block B',
    category: 'Competition', capacity: 60,
  },
  {
    title: 'International Conference on Emerging Technologies',
    description:
      'Two-day conference with paper presentations on AI, IoT, cloud computing and renewable energy. Students can attend all sessions.',
    date: daysFromNow(20), time: '09:30', location: 'Conference Hall, Admin Block',
    category: 'Conference', capacity: 300,
  },
  {
    title: 'Literary Society: Open Mic Night',
    description:
      'Poetry, short stories and music by students. Sign up to perform or simply come and enjoy the evening.',
    date: daysFromNow(10), time: '17:00', location: 'Student Center Lawn',
    category: 'Society', capacity: 80,
  },
  {
    title: 'Web Development Bootcamp with React',
    description:
      'Learn React fundamentals: components, state, hooks and routing. Ideal for beginners who know basic HTML, CSS and JavaScript.',
    date: daysFromNow(18), time: '13:00', location: 'CS Lab 1, Main Campus',
    category: 'Workshop', capacity: 35,
  },
  {
    title: 'Seminar: Research Writing and Publishing',
    description:
      'Learn how to structure a research paper, choose a journal or conference, and avoid common mistakes in academic writing.',
    date: daysFromNow(25), time: '12:00', location: 'Seminar Room 2',
    category: 'Seminar', capacity: 100,
  },
];

function seedDatabase({ reset = false, silent = false } = {}) {
  const log = (...args) => !silent && console.log(...args);

  if (reset) {
    db.exec('DELETE FROM registrations; DELETE FROM events; DELETE FROM users;');
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('registrations','events','users');");
    log('Database cleared.');
  }

  const eventCount = db.prepare('SELECT COUNT(*) AS n FROM events').get().n;
  if (eventCount > 0) {
    log('Database already has data — skipping seed.');
    return;
  }

  const insertUser = db.prepare(
    'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );
  const insertEvent = db.prepare(
    `INSERT INTO events (title, description, date, time, location, category, capacity, created_by)
     VALUES (@title, @description, @date, @time, @location, @category, @capacity, @created_by)`
  );

  const seed = db.transaction(() => {
    insertUser.run('Admin', 'admin@uol.edu.pk', bcrypt.hashSync('admin123', 10), 'admin');
    insertUser.run('Demo Student', 'student@uol.edu.pk', bcrypt.hashSync('student123', 10), 'student');
    const admin = db.prepare("SELECT id FROM users WHERE email = 'admin@uol.edu.pk'").get();
    for (const event of sampleEvents) {
      insertEvent.run({ ...event, created_by: admin.id });
    }
  });
  seed();

  log(`Seeded 2 users and ${sampleEvents.length} events.`);
  log('  Admin   -> admin@uol.edu.pk / admin123');
  log('  Student -> student@uol.edu.pk / student123');
}

// Run directly: node database/seed.js [--reset]
if (require.main === module) {
  seedDatabase({ reset: process.argv.includes('--reset') });
}

module.exports = { seedDatabase };
