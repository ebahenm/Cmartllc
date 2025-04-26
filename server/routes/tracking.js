const router = require('express').Router();
const { updateTracking, getTracking } = require('../controllers/trackingController');

// POST /api/tracking/:bookingId
router.post('/:bookingId', updateTracking);

// GET  /api/tracking/:bookingId
router.get('/:bookingId', getTracking);

module.exports = router;
