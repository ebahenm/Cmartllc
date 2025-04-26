// server/models/VerificationCode.js
const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: '10m' }
  }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);