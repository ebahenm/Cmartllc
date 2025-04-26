// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Driver = require('../models/Driver');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/auth');

// SMS Gateway configuration
const CARRIER_GATEWAYS = {
  verizon: 'vzwpix.com',
  att:    'txt.att.net',
  tmobile:'tmomail.net',
  sprint: 'messaging.sprintpcs.com',
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper: strip to last 10 digits
const formatPhoneNumber = num => num.replace(/\D/g, '').slice(-10);

// POST booking endpoint (public)
router.post('/', async (req, res) => {
  try {
    // 1. Validate required fields
    const required = [
      'name','phone','vehicle',
      'pickupLocation','dropoffLocation',
      'date','time'
    ];
    const missing = required.filter(f => !req.body[f]);
    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // 2. Find or create User
    const { name, phone, email } = req.body;
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name,
        phone,
        email: email || `${phone}@temp.com`,
        password: phone, // temp password
      });
    }

    // 3. Assign Driver
    const driver = await Driver.findOne(
      process.env.DEFAULT_DRIVER_ID
        ? { _id: process.env.DEFAULT_DRIVER_ID }
        : {}
    );
    if (!driver) {
      return res
        .status(503)
        .json({ error: 'No available drivers at this time' });
    }

    // 4. Create Booking
    const booking = await Booking.create({
      user:             user._id,
      driver:           driver._id,
      vehicle:          req.body.vehicle,
      pickupLocation:   req.body.pickupLocation,
      dropoffLocation:  req.body.dropoffLocation,
      date:             req.body.date,
      time:             req.body.time,
      special_requests: req.body.special_requests || '',
    });

    // 5. Populate for response
    const populated = await Booking.findById(booking._id)
      .populate('driver', 'name email phone carrier')
      .populate('user',   'name phone');

    // 6. Send response
    res.status(201).json({
      message: 'Booking created successfully',
      booking: populated
    });

    // 7. Fire-and-forget notifications
    (async function notify() {
      try {
        // Email to driver
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: driver.email,
          subject: '🚕 New Ride Assignment',
          text: formatBookingDetails(populated)
        });

        // SMS via email-to-SMS
        const smsTo = `${formatPhoneNumber(driver.phone)}@${
          CARRIER_GATEWAYS[driver.carrier] || CARRIER_GATEWAYS.verizon
        }`;
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: smsTo,
          text: `New ride: ${populated.pickupLocation} → ${populated.dropoffLocation} at ${populated.time}`
        });

        // Real-time emit to any connected clients
        req.app.locals.io.emit('booking:new', populated);
      } catch (err) {
        console.error('Notification error:', err);
      }
    })();

  } catch (err) {
    console.error('Booking error:', err);
    res
      .status(500)
      .json({ error: err.message || 'Internal server error' });
  }
});

// GET all bookings (protected)
router.get('/', protect, async (req, res) => {
  try {
    const list = await Booking.find()
      .sort({ date: -1, time: -1 })
      .populate('driver', 'name phone')
      .populate('user',   'name phone');
    res.json({ bookings: list });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// Helper to format email text
function formatBookingDetails(b) {
  return `
Passenger: ${b.user.name} (${b.user.phone})
Vehicle:   ${b.vehicle}
Pickup:    ${b.pickupLocation}
Dropoff:   ${b.dropoffLocation}
Date/Time: ${b.date} ${b.time}
Requests:  ${b.special_requests || 'None'}
  `.trim();
}

module.exports = router;
