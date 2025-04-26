//
const Booking   = require('../models/Booking');
const User      = require('../models/User');
const Driver    = require('../models/Driver');
const mailer    = require('../utils/mailer');
const smsGateway= require('../utils/smsGateway');
const { sendMail } = require('../utils/mailer');
const { sendSms }    = require('../utils/smsGateway');
const { getDistance } = require('../utils/distanceCalculator');
const { signToken }   = require('../utils/jwtHelpers');
exports.createBooking = async (req, res) => {
  try {
    // 1️⃣ Find or create the customer
    let user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      user = await new User({
        name : req.body.name,
        phone: req.body.phone,
        email: req.body.email
      }).save();
    }

    // 2️⃣ Assign a driver (hard‐coded or your logic)
    const driver = await Driver.findById(process.env.DEFAULT_DRIVER_ID);
    if (!driver) {
      return res.status(400).json({ error: 'No drivers available.' });
    }

    // 3️⃣ Create the booking
    let booking = await new Booking({
      user,
      driver: driver._id,
      vehicle:          req.body.vehicle,
      pickupLocation:   req.body.pickupLocation,
      dropoffLocation:  req.body.dropoffLocation,
      date:             req.body.date,
      time:             req.body.time,
      special_requests: req.body.special_requests
    }).save();

    // 4️⃣ Populate driver & user for front‑end
    booking = await booking.populate('driver').populate('user');

    // 5️⃣ Notify via email + SMS
    await mailer.sendDriverNotification(driver, user, booking);
    await smsGateway.sendDriverSMS(driver, booking);

    // 6️⃣ Real‑time push to driver dashboards
    req.app.locals.io.emit('newBooking', booking);

    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error('bookingController.createBooking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ date: -1 })
      .populate('driver')
      .populate('user');
    res.json({ bookings });
  } catch (err) {
    console.error('bookingController.getBookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
