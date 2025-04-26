// utils/jwtHelpers.js
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set in .env — tokens will be unsigned');
}

/**
 * Sign a payload into a JWT
 * @param {object} payload 
 * @param {object} [options] jwt.sign options (e.g. { expiresIn: '1h' })
 */
function signToken(payload, options = { expiresIn: '1h' }) {
  return jwt.sign(payload, process.env.JWT_SECRET || '', options);
}

/**
 * Verify and decode a JWT
 * @param {string} token 
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || '');
}

module.exports = { signToken, verifyToken };
