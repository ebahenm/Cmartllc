const mongoose = require('mongoose');
const { Schema } = mongoose;

// Optionally seed this collection with documents like:
// { name: 'assigned' }, { name: 'in_progress' }, etc.
const rideStatusSchema = new Schema({
  name: {
    type: String,
    enum: ['assigned', 'accepted', 'in_progress', 'completed', 'cancelled'],
    required: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RideStatus', rideStatusSchema);
