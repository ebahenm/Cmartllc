// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Driver = require('../models/Driver');

// POST /api/bookings - create a new booking and notify driver
router.post('/', async (req, res) => {
  try {
    console.log("Received booking request:", req.body);

    // 1. Find or create the customer user.
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
      });
      await user.save();
    }
    
    // 2. Force assignment to the test driver.
    const testDriverId = "67fc8da6215db7b1625af726"; // Test driver ID
    const driver = await Driver.findOne({ _id: testDriverId });
    if (!driver) {
      console.error("Test driver not found in the database.");
      return res.status(400).json({ error: 'No drivers available' });
    }
    
    // 3. Create the booking with the correct field names.
    const booking = new Booking({
      user: user._id,
      vehicle: req.body.vehicle,
      pickupLocation: req.body.pickupLocation,  // Use the correct key sent by the client
      dropoffLocation: req.body.dropoffLocation,
      date: req.body.date,                        
      time: req.body.time,                        
      special_requests: req.body.special_requests,
      driver: driver._id,  // Assign the test driver.
    });
    await booking.save();
    
    console.log('Booking created successfully:', booking);
    
    // 4. Emit the newBooking event via Socket.IO.
    if (req.app.locals.io && typeof req.app.locals.io.emit === 'function') {
      req.app.locals.io.emit('newBooking', booking);
      console.log('Emitted newBooking event with booking ID:', booking._id);
    } else {
      console.warn('Socket.IO instance not available - newBooking event not emitted');
    }

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// server/routes/bookings.js
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
