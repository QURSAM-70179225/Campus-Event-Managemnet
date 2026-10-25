const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateEvent, validateIdParam } = require('../middleware/validate');

const router = express.Router();

// Public
router.get('/', getEvents);
router.get('/:id', validateIdParam, getEventById);

// Admin only
router.post('/', authenticate, requireAdmin, validateEvent, createEvent);
router.put('/:id', authenticate, requireAdmin, validateIdParam, validateEvent, updateEvent);
router.delete('/:id', authenticate, requireAdmin, validateIdParam, deleteEvent);

module.exports = router;
