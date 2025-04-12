// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User'); // or your user model
const Driver = require('../models/Driver');

// POST /api/bookings - create a new booking and notify driver
router.post('/', async (req, res) => {
  try {
    // --- 1. Handle user creation/fetching (example) ---
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      });
      await user.save();
    }
    
    // --- 2. Select a driver (for example, the first available driver) ---
    const driver = await Driver.findOne();
    if (!driver) {
      return res.status(400).json({ error: 'No drivers available' });
    }
    
    // --- 3. Create the booking ---
    const booking = new Booking({
      user: user._id,
      // Include additional booking fields as needed
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      date: req.body.date,
      time: req.body.time,
      status: 'pending',
      driver: driver._id  // assign the driver
    });
    await booking.save();
    
    // --- 4. Notify the driver via Socket.IO ---
    // app.locals.io is set in server.js; emit "newBooking" event to all connected clients.
    req.app.locals.io.emit('newBooking', booking);
    
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
