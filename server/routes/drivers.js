// server/routes/drivers.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET /api/drivers/:driverId/bookings - get bookings assigned to a driver
router.get('/:driverId/bookings', async (req, res) => {
  try {
    const { driverId } = req.params;
    // find bookings assigned to this driver
    const bookings = await Booking.find({ driver: driverId }).sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/drivers/:driverId/booking/:bookingId/status
// Example of updating booking status (accept, complete, etc.)
router.post('/:driverId/booking/:bookingId/status', async (req, res) => {
  try {
    const { driverId, bookingId } = req.params;
    const { status } = req.body; // e.g. 'assigned' or 'completed'

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, driver: driverId },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
