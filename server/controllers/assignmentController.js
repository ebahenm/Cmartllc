//server/controllers/assignmentController.js
const Booking = require('../models/Booking');
const Driver  = require('../models/Driver');

// POST /api/assignment
//   body: { bookingId, driverId }
exports.assignDriver = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { driver: driver._id, status: 'assigned' },
      { new: true }
    ).populate('user driver');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    req.app.locals.io.emit('newAssignment', booking);
    res.json({ message: 'Driver assigned', booking });
  } catch (err) {
    console.error('assignmentController.assignDriver error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
