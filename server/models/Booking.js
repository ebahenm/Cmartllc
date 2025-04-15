// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  special_requests: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
