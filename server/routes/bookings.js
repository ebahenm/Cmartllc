// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public (You may add authentication later)
router.post('/', async (req, res) => {
  try {
    // 1) Check if the user already exists or create new
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      });
      await user.save();
    }

    // 2) Find the selected vehicle
    const vehicle = await Vehicle.findOne({ _id: req.body.vehicleId });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // 3) Create the booking
    const booking = new Booking({
      user: user._id,
      vehicle: vehicle._id,
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      date: req.body.date,  // e.g., "2025-05-12"
      time: req.body.time   // e.g., "10:30 AM"
    });

    await booking.save();

    // 4) Return the newly created booking
    return res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
