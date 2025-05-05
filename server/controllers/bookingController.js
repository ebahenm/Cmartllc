// controllers/bookingController.js
const Booking  = require('../models/Booking');
const User     = require('../models/User');
const Driver   = require('../models/Driver');
const { sendMail } = require('../utils/mailer');
const { sendSms  } = require('../utils/smsGateway');

exports.createBooking = async (req, res) => {
  try {
    // … your existing user/driver lookup and booking.save() …

    // populate so we have emails/phones
    booking = await booking.populate('user').populate('driver');

    // 1️⃣ Notify the passenger by email
    await sendMail({
      to:      booking.user.email,
      subject: 'Your CMART LLC Booking Confirmation',
      text: `
Hi ${booking.user.name},

Your ride is confirmed for ${booking.date} at ${booking.time}.
Pickup:  ${booking.pickupLocation}
Dropoff: ${booking.dropoffLocation}

Reply to this email if you need to change anything.
      `,
      html: `
<p>Hi <strong>${booking.user.name}</strong>,</p>
<ul>
  <li><strong>Date:</strong> ${booking.date}</li>
  <li><strong>Time:</strong> ${booking.time}</li>
  <li><strong>Pickup:</strong> ${booking.pickupLocation}</li>
  <li><strong>Dropoff:</strong> ${booking.dropoffLocation}</li>
</ul>
<p>Reply to this email if you need to change anything.</p>
      `
    });

    // 2️⃣ Notify the passenger by SMS
    await sendSms(
      booking.user.phone,
      `CMART LLC: Your ride on ${booking.date} at ${booking.time} from ${booking.pickupLocation} to ${booking.dropoffLocation} is confirmed!`
    );

    // 3️⃣ Notify the driver by email (if driver.email exists)
    if (booking.driver.email) {
      await sendMail({
        to:      booking.driver.email,
        subject: 'New Booking Assigned',
        text: `
Hello ${booking.driver.name},

You have a new booking:
  • Passenger: ${booking.user.name}
  • Date:      ${booking.date} at ${booking.time}
  • From:      ${booking.pickupLocation}
  • To:        ${booking.dropoffLocation}

Please confirm on your dashboard.
        `
      });
    }

    // 4️⃣ Notify the driver by SMS
    await sendSms(
      booking.driver.phone,
      `New CMART booking: ${booking.date} @ ${booking.time}. Pickup: ${booking.pickupLocation} → ${booking.dropoffLocation}.`
    );

    // push to real-time dashboard
    req.app.locals.io.emit('newBooking', booking);

    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error('bookingController.createBooking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
