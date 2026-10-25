/**
 * Event CRUD handlers.
 */
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

// GET /api/events?search=AI&category=Workshop
function getEvents(req, res, next) {
  try {
    const search = (req.query.search || '').trim();
    const category = (req.query.category || '').trim();
    const events = Event.findAll({ search, category: category === 'All' ? '' : category });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /api/events/:id
function getEventById(req, res, next) {
  try {
    const event = Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// POST /api/events (admin)
function createEvent(req, res, next) {
  try {
    const event = Event.create({ ...req.body, created_by: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

// PUT /api/events/:id (admin)
function updateEvent(req, res, next) {
  try {
    const existing = Event.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    const registered = Registration.countForEvent(req.params.id);
    if (req.body.capacity < registered) {
      return res.status(400).json({
        error: `Capacity cannot be less than the ${registered} students already registered`,
      });
    }

    res.json(Event.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/events/:id (admin)
function deleteEvent(req, res, next) {
  try {
    const deleted = Event.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
