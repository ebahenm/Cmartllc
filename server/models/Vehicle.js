// server/models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: { type: String, required: true },   // e.g. 'SUV', 'Minivan'
  model: { type: String, required: true },  // e.g. 'Chevrolet Suburban'
  year: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
