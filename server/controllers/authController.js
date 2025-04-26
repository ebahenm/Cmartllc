// server/controllers/authController.js
const VerificationCode = require('../models/VerificationCode');
const { buildSmsAddress, transporter } = require('../utils/email'); // Reuse your existing email setup

exports.sendVerification = async (req, res) => {
  try {
    const { phone } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save verification code
    await VerificationCode.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + 10*60*1000) // 10 minutes
    });

    // Send SMS
    const smsAddr = buildSmsAddress(phone);
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: smsAddr,
      text: `Your verification code is: ${code}`
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { phone, code } = req.body;
    const record = await VerificationCode.findOne({
      phone,
      code,
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    res.json({ verified: true });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
};