// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Driver = require('../models/Driver');
console.log("Driver model:", Driver);

// POST /api/bookings - create a new booking and notify driver
router.post('/', async (req, res) => {
  try {
    // 1. Find or create the customer user
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      });
      await user.save();
    }
    
    // 2. Instead of doing a generic query, force the booking to be assigned to the test driver.
    const testDriverId = "67fc8da6215db7b1625af726"; // Test driver ID

    // Optionally, you can verify the driver exists in your database.
    const driver = await Driver.findOne({ _id: testDriverId });
    if (!driver) {
      return res.status(400).json({ error: 'No drivers available' });
    }
    
    // 3. Create the booking with the required fields.
    const booking = new Booking({
      user: user._id,
      vehicle: req.body.vehicle,
      pickupLocation: req.body.pickup_location,  // Ensure keys match your Booking schema
      dropoffLocation: req.body.dropoff_location,
      date: req.body.date,                        // Should be provided if you split date/time in frontend
      time: req.body.time,
      special_requests: req.body.special_requests,
      driver: driver._id,  // Assign the test driver
    });
    await booking.save();
    
    // 4. Emit the newBooking event via Socket.IO
    console.log('Emitting newBooking event with booking:', booking);
    req.app.locals.io.emit('newBooking', booking);

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
