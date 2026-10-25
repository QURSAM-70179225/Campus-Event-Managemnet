/**
 * JWT authentication + role-based access.
 *   authenticate  -> requires "Authorization: Bearer <token>"
 *   requireAdmin  -> only users with role "admin"
 */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_secret_change_me';
const TOKEN_EXPIRES_IN = '7d';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Login required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'User no longer exists' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, requireAdmin, signToken };
