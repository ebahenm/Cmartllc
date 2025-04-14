// server/models/Driver.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
}, { timestamps: true });

// Export the Mongoose model. This model will have methods like .findOne()
module.exports = mongoose.model('Driver', driverSchema);
