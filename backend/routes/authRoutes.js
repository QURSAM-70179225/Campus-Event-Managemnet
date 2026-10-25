const express = require('express');
const { signup, login, me } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, me);

module.exports = router;
