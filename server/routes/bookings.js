// server/routes/bookings.js
const express     = require('express');
const router      = express.Router();
const Booking     = require('../models/Booking');
const Driver      = require('../models/Driver');
const nodemailer  = require('nodemailer');
const { protect } = require('../middleware/auth');

// SMS Gateway map
const CARRIER_GATEWAYS = {
  verizon: 'vzwpix.com',
  att:     'txt.att.net',
  tmobile: 'tmomail.net',
  sprint:  'messaging.sprintpcs.com'
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper: strip to last 10 digits
const formatPhoneNumber = num => num.replace(/\D/g, '').slice(-10);

// Helper: format booking details for notifications
function formatBookingDetails(b) {
  return `
Passenger: ${b.name} (${b.phone})
Vehicle:   ${b.vehicle}
Pickup:    ${b.pickupLocation}
Dropoff:   ${b.dropoffLocation}
Date/Time: ${b.date} ${b.time}
Requests:  ${b.special_requests || 'None'}
  `.trim();
}

// ── Create a new booking (public—no JWT needed) ───────────────────────────
router.post('/', async (req, res) => {
  try {
    // 1) Validate required booking fields
    const required = ['name','phone','vehicle','pickupLocation','dropoffLocation','date','time'];
    const missing = required.filter(field => !req.body[field]);
    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // 2) Find a driver
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

    // 3) Create the Booking document
    const booking = new Booking({
      driver:          driver._id,
      vehicle:         req.body.vehicle,
      pickupLocation:  req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      date:            req.body.date,
      time:            req.body.time,
      special_requests: req.body.special_requests || '',
      name:            req.body.name,
      phone:           req.body.phone,
      email:           req.body.email
    });
    await booking.save();

    // 4) Populate for response
    const populated = await Booking.findById(booking._id)
      .populate('driver', 'name email phone carrier');

    // 5) Send success response
    res.status(201).json({
      message: 'Booking created successfully',
      booking: populated
    });

    // 6) Fire-and-forget notifications
    (async () => {
      try {
        // Email to driver
        await transporter.sendMail({
          from:    process.env.SMTP_USER,
          to:      driver.email,
          subject: '🚕 New Ride Assignment',
          text:    formatBookingDetails({
            ...req.body,
            vehicle:         req.body.vehicle,
            pickupLocation:  req.body.pickupLocation,
            dropoffLocation: req.body.dropoffLocation,
            date:            req.body.date,
            time:            req.body.time,
            special_requests: req.body.special_requests,
          })
        });

        // SMS via email-to-SMS gateway
        const smsAddr = `${formatPhoneNumber(driver.phone)}@${
          CARRIER_GATEWAYS[driver.carrier] || CARRIER_GATEWAYS.verizon
        }`;
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to:   smsAddr,
          text: `New ride: ${req.body.pickupLocation} → ${req.body.dropoffLocation} at ${req.body.time}`
        });

        // Real-time push via Socket.IO
        req.app.locals.io.emit('booking:new', populated);
      } catch (err) {
        console.error('Notification error:', err);
      }
    })();
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// ── Fetch all bookings (admin-only) ────────────────────────────────────────
router.get('/', protect(), async (req, res) => {
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

module.exports = router;
