// server/models/Driver.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  phone:    { type: String, required: true, unique: true },
  email:    { type: String },
  password: { type: String, required: true },
  carrier:  { type: String }         // for SMS gateway
});

// Hash password before saving
driverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a plain text password to the hashed one
driverSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);
