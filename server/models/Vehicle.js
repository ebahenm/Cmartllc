const mongoose = require('mongoose');
const { Schema } = mongoose;

const vehicleSchema = new Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  passengerCapacity: {
    type: Number,
    required: true
  },
  luggageCapacity: {
    type: Number,
    required: true
  },
  features: [String],      // e.g. ['Wifi', 'Child Seat']
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
