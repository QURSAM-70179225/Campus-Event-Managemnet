const express = require('express');
const {
  registerForEvent,
  getRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');
const { authenticate } = require('../middleware/auth');
const { validateRegistration, validateIdParam } = require('../middleware/validate');

const router = express.Router();

router.post('/register', authenticate, validateRegistration, registerForEvent);
router.get('/registrations', authenticate, getRegistrations);
router.delete('/registrations/:id', authenticate, validateIdParam, cancelRegistration);

module.exports = router;
