// server/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Guest info
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },

  // Assigned driver
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },

  // Ride details
  vehicle: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  special_requests: {
    type: String,
    default: ''
  },

  // Optional user reference (for logged-in bookings)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // remove `required: true` so it's optional
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
