/**
 * Student event registration handlers.
 */
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

// POST /api/register   body: { event_id }
function registerForEvent(req, res, next) {
  try {
    const eventId = req.body.event_id;
    const event = Event.findById(eventId);

    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (Registration.findByUserAndEvent(req.user.id, eventId)) {
      return res.status(409).json({ error: 'You are already registered for this event' });
    }

    if (event.seats_available <= 0) {
      return res.status(400).json({ error: 'Sorry, this event is full' });
    }

    const registration = Registration.create(req.user.id, eventId);
    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (err) {
    next(err);
  }
}

// GET /api/registrations
//   admin   -> all registrations (optional ?event_id=)
//   student -> only their own registrations
function getRegistrations(req, res, next) {
  try {
    if (req.user.role === 'admin') {
      const eventId = req.query.event_id ? Number(req.query.event_id) : undefined;
      return res.json(Registration.findAll({ eventId }));
    }
    res.json(Registration.findByUser(req.user.id));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/registrations/:id   (owner or admin)
function cancelRegistration(req, res, next) {
  try {
    const registration = Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });

    if (req.user.role !== 'admin' && registration.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only cancel your own registrations' });
    }

    Registration.remove(req.params.id);
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerForEvent, getRegistrations, cancelRegistration };
