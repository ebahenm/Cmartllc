// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const JWT_SECRET = process.env.JWT_SECRET;

// Main authentication middleware
const protect = (role) => {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed token.' });
    }

    try {
      const token = header.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET);

      // Choose model based on role
      const Model = payload.role === 'driver' ? Driver : User;
      req.user = await Model.findById(payload.id).select('-password');

      // Role enforcement
      if (role && payload.role !== role) {
        return res.status(403).json({ error: 'Forbidden: wrong role.' });
      }

      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
};

// Verification middleware
const requireVerification = async (req, res, next) => {
  if (req.path === '/signup' && req.body.bookingData) {
    const verified = await checkVerification(req.body.phone);
    if (!verified) return res.status(403).json({ error: 'Verification required' });
  }
  next();
};

// Single export statement
module.exports = {
  protect,
  requireVerification
};