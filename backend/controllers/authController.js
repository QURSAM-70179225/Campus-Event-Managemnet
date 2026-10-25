/**
 * Authentication: sign up and log in.
 */
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { signToken } = require('../middleware/auth');

// POST /api/signup
async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (User.findByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    // New accounts are always students; admins are created by the seed script
    const user = User.create({ name, email, password: hash, role: 'student' });

    res.status(201).json({ message: 'Account created successfully', token: signToken(user), user });
  } catch (err) {
    next(err);
  }
}

// POST /api/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = User.findByEmail(email);

    const valid = user && (await bcrypt.compare(password, user.password));
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password: _hidden, ...publicUser } = user;
    res.json({ message: 'Login successful', token: signToken(publicUser), user: publicUser });
  } catch (err) {
    next(err);
  }
}

// GET /api/me
function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { signup, login, me };
