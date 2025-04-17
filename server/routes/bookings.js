// server/routes/bookings.js

const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/Booking');
const User       = require('../models/User');
const Driver     = require('../models/Driver');
const nodemailer = require('nodemailer');

// … your existing mailer & helper setup …

router.post('/', async (req, res) => {
  try {
    // (a) Find or create customer...
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = await new User({ /* ... */ }).save();
    }

    // (b) Get the driver
    const testDriverId = "67fc8da6215db7b1625af726";
    const driver = await Driver.findById(testDriverId);
    if (!driver) return res.status(400).json({ error: 'No drivers available' });

    // (c) Create booking
    let booking = await new Booking({
      user:            user._id,
      vehicle:         req.body.vehicle,
      pickupLocation:  req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      date:            req.body.date,
      time:            req.body.time,
      special_requests:req.body.special_requests,
      driver:          driver._id
    }).save();

    // (d) Populate the driver field
    booking = await booking.populate('driver');

    // (e) Send email & SMS exactly as before (without exposing booking._id)

    // … your mailer logic …

    // (f) Emit via Socket.IO
    req.app.locals.io?.emit('newBooking', booking);

    // (g) Send the populated booking back to the client
    res.status(201).json({ message: 'Booking created', booking });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// … your GET /api/bookings handler …

module.exports = router;
