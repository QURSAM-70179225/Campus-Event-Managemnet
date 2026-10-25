/**
 * Database tests — verify INSERT, SELECT, UPDATE and DELETE on every table.
 * Uses an in-memory SQLite database so the real data file is never touched.
 * Run: npm test
 */
process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

const sampleEvent = {
  title: 'Database Test Seminar',
  description: 'Testing CRUD operations',
  date: '2030-01-15',
  time: '10:00',
  location: 'Room 101',
  category: 'Seminar',
  capacity: 2,
};

let student;
let event;

test('INSERT + SELECT user', () => {
  student = User.create({ name: 'Test Student', email: 'test@uol.edu.pk', password: 'hash' });
  assert.equal(student.email, 'test@uol.edu.pk');
  assert.equal(student.role, 'student');
  assert.equal(student.password, undefined, 'password hash must not be returned by findById');

  const found = User.findByEmail('test@uol.edu.pk');
  assert.equal(found.id, student.id);
});

test('UNIQUE email constraint is enforced', () => {
  assert.throws(
    () => User.create({ name: 'Copy', email: 'test@uol.edu.pk', password: 'x' }),
    (err) => err.code === 'SQLITE_CONSTRAINT_UNIQUE'
  );
});

test('INSERT + SELECT event with seat count', () => {
  event = Event.create(sampleEvent);
  assert.equal(event.title, sampleEvent.title);
  assert.equal(event.registered, 0);
  assert.equal(event.seats_available, 2);
});

test('SELECT events with search and category filter', () => {
  Event.create({ ...sampleEvent, title: 'Football Match', category: 'Sports' });
  assert.equal(Event.findAll({ search: 'Football' }).length, 1);
  assert.equal(Event.findAll({ category: 'Seminar' }).length, 1);
  assert.equal(Event.findAll({ search: 'does-not-exist' }).length, 0);
  assert.equal(Event.findAll().length, 2);
});

test('UPDATE event', () => {
  const updated = Event.update(event.id, { ...sampleEvent, title: 'Updated Title', capacity: 5 });
  assert.equal(updated.title, 'Updated Title');
  assert.equal(updated.capacity, 5);
  assert.equal(Event.update(9999, sampleEvent), null);
});

test('CHECK constraint rejects invalid category', () => {
  assert.throws(() => Event.create({ ...sampleEvent, category: 'Party' }));
});

test('INSERT registration and seats decrease', () => {
  const reg = Registration.create(student.id, event.id);
  assert.equal(reg.student_email, 'test@uol.edu.pk');
  assert.equal(reg.event_title, 'Updated Title');
  assert.equal(Event.findById(event.id).seats_available, 4);
  assert.equal(Registration.findByUser(student.id).length, 1);
});

test('UNIQUE(user_id, event_id) prevents double registration', () => {
  assert.throws(() => Registration.create(student.id, event.id));
});

test('DELETE event cascades to its registrations', () => {
  assert.equal(Event.remove(event.id), true);
  assert.equal(Event.findById(event.id), undefined);
  assert.equal(Registration.findByUser(student.id).length, 0);
});

test('DELETE user', () => {
  assert.equal(User.remove(student.id), true);
  assert.equal(User.findById(student.id), undefined);
});
