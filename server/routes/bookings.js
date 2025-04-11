// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User'); // or whichever user model you have
const Driver = require('../models/Driver');
const { sendSMS } = require('../notifications/sms'); // if using SMS

// POST /api/bookings - create a new booking
router.post('/', async (req, res) => {
  try {
    // 1) Find or create user
    //    (This depends on how your existing code handles user data)
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      });
      await user.save();
    }

    // 2) Select a driver (for now, pick the first driver in the DB or a specific driver)
    const driver = await Driver.findOne(); // naive approach
    if (!driver) {
      return res.status(400).json({ error: 'No drivers available' });
    }

    // 3) Create the booking
    const booking = new Booking({
      user: user._id,
      // vehicle: ID of the vehicle from your request or logic
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      date: req.body.date,
      time: req.body.time,
      // default status: 'pending'
      driver: driver._id
    });
    await booking.save();

    // 4) Notify the driver (SMS or email)
    const message = `New Booking!\nPickup: ${booking.pickupLocation}\nDropoff: ${booking.dropoffLocation}\nDate/Time: ${booking.date}, ${booking.time}`;
    sendSMS(driver.phone, message); // or your chosen method

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
