// server/models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  // Possibly store vehicle(s) linked to this driver
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }
  // Add other fields like availability status, etc.
});

module.exports = mongoose.model('Driver', driverSchema);
