// models/Booking.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  vehicle: {
    type: String,
    required: true,
    trim: true
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  dropoffLocation: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,  // e.g. "2025-04-17"
    required: true
  },
  time: {
    type: String,  // e.g. "14:30"
    required: true
  },
  special_requests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'assigned'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
