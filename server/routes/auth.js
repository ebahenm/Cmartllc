// server/routes/auth.js
// ── full authentication routes, including signup, login, verify, phone‐check, forgot/reset password

const express      = require('express');
const router       = express.Router();
const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcryptjs');
const crypto       = require('crypto');
const transporter  = require('../utils/mailer');     // ← our mailer
const User         = require('../models/User');
const { protect }  = require('../middleware/auth');

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

    const emailToUse = email?.trim()
      ? email.trim().toLowerCase()
      : `${cleanPhone}@temp.com`;

    const user = new User({ name, email: emailToUse, phone: cleanPhone, password });
    await user.save();

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

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return res.status(400).json({ error: 'Invalid phone or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid phone or password.' });
    }

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

// ── Check Phone ─────────────────────────────────────────────────────────────
router.post('/check-phone', async (req, res) => {
  try {
    const cleanPhone = req.body.phone.replace(/\D/g, '').slice(-10);
    const exists = Boolean(await User.findOne({ phone: cleanPhone }));
    res.json({ exists });
  } catch (err) {
    console.error('Check-phone error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Forgot Password: send reset link ────────────────────────────────────────
router.post('/forgotpassword', async (req, res) => {
  try {
    const cleanPhone = req.body.phone.replace(/\D/g, '').slice(-10);
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return res.status(400).json({ error: 'No account with that phone.' });
    }

    // create a one-time token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken   = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${token}`;
    await transporter.sendMail({
      from:    process.env.SMTP_USER,
      to:      user.email,
      subject: 'Password Reset Request',
      text:    `You requested a password reset. Click here to set a new password:\n\n${resetUrl}`
    });

    res.json({ message: 'Reset link sent to your email.' });
  } catch (err) {
    console.error('Forgot-password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Reset Password: accept token + new password ─────────────────────────────
router.post('/resetpassword', async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const newToken = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    });

    res.json({ token: newToken });
  } catch (err) {
    console.error('Reset-password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
