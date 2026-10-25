/**
 * REST API tests (GET, POST, PUT, DELETE) using supertest.
 * Runs against an in-memory database seeded with sample data.
 * Run: npm test
 */
process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../app');
const { seedDatabase } = require('../database/seed');

let adminToken;
let studentToken;
let createdEventId;

before(async () => {
  seedDatabase({ silent: true });

  const admin = await request(app)
    .post('/api/login')
    .send({ email: 'admin@uol.edu.pk', password: 'admin123' });
  adminToken = admin.body.token;
});

// ---------- Health ----------
test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('Unknown route returns 404 JSON', async () => {
  const res = await request(app).get('/api/nothing-here');
  assert.equal(res.status, 404);
  assert.ok(res.body.error);
});

// ---------- Auth ----------
test('POST /api/signup creates a student account', async () => {
  const res = await request(app)
    .post('/api/signup')
    .send({ name: 'Ali Khan', email: 'ali@uol.edu.pk', password: 'secret123' });
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.role, 'student');
  assert.equal(res.body.user.password, undefined);
  studentToken = res.body.token;
});

test('POST /api/signup rejects duplicate email (409)', async () => {
  const res = await request(app)
    .post('/api/signup')
    .send({ name: 'Ali Again', email: 'ALI@uol.edu.pk', password: 'secret123' });
  assert.equal(res.status, 409);
});

test('POST /api/signup validates input (400)', async () => {
  const res = await request(app).post('/api/signup').send({ name: 'A', email: 'bad', password: '1' });
  assert.equal(res.status, 400);
  assert.equal(res.body.details.length, 3);
});

test('POST /api/login with wrong password returns 401', async () => {
  const res = await request(app)
    .post('/api/login')
    .send({ email: 'admin@uol.edu.pk', password: 'wrong' });
  assert.equal(res.status, 401);
});

test('POST /api/login returns a token', async () => {
  const res = await request(app)
    .post('/api/login')
    .send({ email: 'ali@uol.edu.pk', password: 'secret123' });
  assert.equal(res.status, 200);
  assert.ok(res.body.token);
});

// ---------- Events ----------
test('GET /api/events lists seeded events with seats', async () => {
  const res = await request(app).get('/api/events');
  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 8);
  assert.ok('seats_available' in res.body[0]);
});

test('GET /api/events?search=AI finds the AI workshop', async () => {
  const res = await request(app).get('/api/events').query({ search: 'AI Workshop' });
  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 1);
  assert.match(res.body[0].title, /AI Workshop/);
});

test('GET /api/events?category=Sports filters by category', async () => {
  const res = await request(app).get('/api/events').query({ category: 'Sports' });
  assert.equal(res.status, 200);
  assert.ok(res.body.every((e) => e.category === 'Sports'));
});

test('GET /api/events/:id returns one event, 404 when missing', async () => {
  const ok = await request(app).get('/api/events/1');
  assert.equal(ok.status, 200);
  assert.equal(ok.body.id, 1);

  const missing = await request(app).get('/api/events/9999');
  assert.equal(missing.status, 404);

  const invalid = await request(app).get('/api/events/abc');
  assert.equal(invalid.status, 400);
});

const newEvent = {
  title: 'Postman Testing Workshop',
  description: 'Learn to test REST APIs',
  date: '2030-03-10',
  time: '15:00',
  location: 'Lab 4',
  category: 'Workshop',
  capacity: 1,
};

test('POST /api/events requires login (401) and admin role (403)', async () => {
  const noToken = await request(app).post('/api/events').send(newEvent);
  assert.equal(noToken.status, 401);

  const asStudent = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${studentToken}`)
    .send(newEvent);
  assert.equal(asStudent.status, 403);
});

test('POST /api/events validates fields (400)', async () => {
  const res = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...newEvent, category: 'Party', capacity: 0, date: '10-03-2030' });
  assert.equal(res.status, 400);
  assert.equal(res.body.details.length, 3);
});

test('POST /api/events creates an event as admin (201)', async () => {
  const res = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(newEvent);
  assert.equal(res.status, 201);
  assert.equal(res.body.title, newEvent.title);
  createdEventId = res.body.id;
});

test('PUT /api/events/:id updates the event', async () => {
  const res = await request(app)
    .put(`/api/events/${createdEventId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...newEvent, title: 'Advanced Postman Workshop' });
  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'Advanced Postman Workshop');
});

// ---------- Registrations ----------
test('POST /api/register registers a student (201)', async () => {
  const res = await request(app)
    .post('/api/register')
    .set('Authorization', `Bearer ${studentToken}`)
    .send({ event_id: createdEventId });
  assert.equal(res.status, 201);
  assert.equal(res.body.registration.event_id, createdEventId);
});

test('POST /api/register twice returns 409', async () => {
  const res = await request(app)
    .post('/api/register')
    .set('Authorization', `Bearer ${studentToken}`)
    .send({ event_id: createdEventId });
  assert.equal(res.status, 409);
});

test('POST /api/register on a full event returns 400', async () => {
  const res = await request(app)
    .post('/api/register')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ event_id: createdEventId });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /full/i);
});

test('GET /api/registrations: student sees own, admin sees all', async () => {
  const mine = await request(app)
    .get('/api/registrations')
    .set('Authorization', `Bearer ${studentToken}`);
  assert.equal(mine.status, 200);
  assert.equal(mine.body.length, 1);

  const all = await request(app)
    .get('/api/registrations')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(all.status, 200);
  assert.ok(all.body.length >= 1);
});

test('PUT cannot reduce capacity below registered count', async () => {
  const res = await request(app)
    .put(`/api/events/${createdEventId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...newEvent, capacity: 0 });
  assert.equal(res.status, 400);
});

test('DELETE /api/registrations/:id cancels a registration', async () => {
  const mine = await request(app)
    .get('/api/registrations')
    .set('Authorization', `Bearer ${studentToken}`);
  const res = await request(app)
    .delete(`/api/registrations/${mine.body[0].id}`)
    .set('Authorization', `Bearer ${studentToken}`);
  assert.equal(res.status, 200);
});

test('DELETE /api/events/:id deletes the event', async () => {
  const res = await request(app)
    .delete(`/api/events/${createdEventId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(res.status, 200);

  const check = await request(app).get(`/api/events/${createdEventId}`);
  assert.equal(check.status, 404);
});
