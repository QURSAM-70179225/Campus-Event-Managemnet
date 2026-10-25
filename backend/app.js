/**
 * Express application (exported separately from server.js so tests can import it).
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// CORS: allow the front-end URL(s) from .env, or everything when CLIENT_URL=*
const allowed = (process.env.CLIENT_URL || '*').split(',').map((s) => s.trim());
app.use(cors({ origin: allowed.includes('*') ? '*' : allowed }));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'Campus Event Management API', status: 'running', docs: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


app.use(notFound);
app.use(errorHandler);

module.exports = app;
