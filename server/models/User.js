// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String }
 // role: { type: String, default: 'customer' }, // 'driver', 'admin', etc.
});

module.exports = mongoose.model('User', userSchema);
