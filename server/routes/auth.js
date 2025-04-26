// server/routes/auth.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// ── Sign Up ────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required.' });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (await User.findOne({ phone: cleanPhone })) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    // Default email placeholder if none provided
    const emailToUse = email?.trim()
      ? email.trim().toLowerCase()
      : `${cleanPhone}@temp.com`;

    // Create & save user (password will be hashed by your pre-save hook)
    const user = new User({ name, email: emailToUse, phone: cleanPhone, password });
    await user.save();

    // Issue JWT
    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ── Log In ─────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required.' });
    }

    // Normalize phone
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return res.status(400).json({ error: 'Invalid phone or password.' });
    }

    // Use your model's comparePassword() utility
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid phone or password.' });
    }

    // Issue JWT
    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ── Verify Token ────────────────────────────────────────────────────────────
router.get('/verify', protect, (req, res) => {
  res.json({ ok: true, userId: req.user._id });
});


// ── Check Phone (for signup flows) ─────────────────────────────────────────
router.post('/check-phone', async (req, res) => {
  const { phone } = req.body;
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const exists = Boolean(await User.findOne({ phone: cleanPhone }));
  res.json({ exists });
});

// Forgot Password: send reset link
router.post('/forgot-password', async (req, res) => {
    const { phone } = req.body;
    const cleanPhone = phone.replace(/\D/g,'').slice(-10);
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) return res.status(400).json({ error: 'No account with that phone.' });
  
    // Generate reset token (unhashed for email)
    const token = crypto.randomBytes(20).toString('hex');
    // Hash for storage
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
  
    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click to reset your password: ${resetUrl}`
    });
  
    res.json({ message: 'Reset link sent to your email.' });
  });
  
  // Reset Password: accept token + new password
  router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });
  
    // Set new password + clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    // Issue new JWT
    const newToken = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token: newToken });
  });
  


module.exports = router;
