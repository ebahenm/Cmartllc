// server/routes/bookings.js
const express  = require('express');
const router   = express.Router();

const Booking  = require('../models/Booking');
const User     = require('../models/User');
const Driver   = require('../models/Driver');

const nodemailer = require('nodemailer');

/* ------------------------------------------------------------------ */
/* 1.  Helper: build the proper 10digits@gateway address               */
/* ------------------------------------------------------------------ */
const GATEWAYS = {
  verizon : 'vzwpix.com',          // Spectrum Mobile & Visible, too
  att     : 'txt.att.net',
  tmobile : 'tmomail.net',
  sprint  : 'messaging.sprintpcs.com'
  // add more as you need them
};

function buildSmsAddress(rawNumber, carrier = 'verizon') {
  // keep only digits, then last 10
  const digits10 = rawNumber.replace(/\D/g, '').slice(-10);
  const gateway  = GATEWAYS[carrier.toLowerCase()] || GATEWAYS.verizon;
  return `${digits10}@${gateway}`;           // → 5046410004@vzwpix.com
}

/* ------------------------------------------------------------------ */
/* 2.  Nodemailer transporter                                          */
/* ------------------------------------------------------------------ */
const transporter = nodemailer.createTransport({
  host  : 'smtp.gmail.com',
  port  : 465,
  secure: true,
  auth  : {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/* ------------------------------------------------------------------ */
/* 3.  Route: POST /api/bookings                                       */
/* ------------------------------------------------------------------ */
router.post('/', async (req, res) => {
  try {
    /* 3‑a  Customer (create if new) */
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = await new User({
        name : req.body.name,
        phone: req.body.phone,
        email: req.body.email
      }).save();
    }

    /* 3‑b  Assign the (single) test driver */
    const driver = await Driver.findById('67fc8da6215db7b1625af726');
    if (!driver) return res.status(400).json({ error: 'No drivers available' });

    /* 3‑c  Create booking */
    let booking = await new Booking({
      user            : user._id,
      driver          : driver._id,
      vehicle         : req.body.vehicle,
      pickupLocation  : req.body.pickupLocation,
      dropoffLocation : req.body.dropoffLocation,
      date            : req.body.date,
      time            : req.body.time,
      special_requests: req.body.special_requests
    }).save();

    /* 3‑d  Populate driver for the client */
    booking = await booking.populate('driver');

    /* 3‑e  E‑mail the driver (no booking ID exposed) */
    await transporter.sendMail({
      from   : process.env.SMTP_USER,
      to     : driver.email,
      subject: '🛎️  New Ride Assigned',
      text   : `
Hi ${driver.name},

A new ride has been booked.

Passenger : ${user.name} (${user.phone})
Vehicle   : ${booking.vehicle}
Pickup    : ${booking.pickupLocation}
Drop‑off  : ${booking.dropoffLocation}
Date/Time : ${booking.date} ${booking.time}

Please check your dashboard for details.
`.trim()
    });

    /* 3‑f  **Optional SMS** via e‑mail‑to‑text gateway */
    const smsAddress = buildSmsAddress(driver.phone, driver.carrier); // e.g. verizon
    await transporter.sendMail({
      from   : process.env.SMTP_USER,
      to     : smsAddress,
      subject: '',
      text   : `New ride ${booking.pickupLocation} ➜ ${booking.dropoffLocation}
${booking.date} ${booking.time}`
    });

    /* 3‑g  Real‑time push to driver dashboard */
    req.app.locals.io?.emit('newBooking', booking);

    /* 3‑h  Respond to front‑end */
    res.status(201).json({ message: 'Booking created', booking });

  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ------------------------------------------------------------------ */
/* 4.  Route: GET /api/bookings (dashboard)                            */
/* ------------------------------------------------------------------ */
router.get('/', async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 }).populate('driver');
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
