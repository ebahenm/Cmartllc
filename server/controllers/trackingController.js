//server/controllers/trackingController.js
const Booking = require('../models/Booking');

// POST /api/tracking/:bookingId
//   body: { lat, lng, status }
exports.updateTracking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { lat, lng, status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { 'tracking.lat': lat, 'tracking.lng': lng, status } },
      { new: true }
    ).populate('user driver');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    req.app.locals.io.emit('trackingUpdate', {
      bookingId,
      lat,
      lng,
      status
    });

    res.json({ message: 'Tracking updated', booking });
  } catch (err) {
    console.error('trackingController.updateTracking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/tracking/:bookingId
exports.getTracking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .select('tracking status')
      .populate('user driver');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ tracking: booking.tracking, status: booking.status });
  } catch (err) {
    console.error('trackingController.getTracking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
