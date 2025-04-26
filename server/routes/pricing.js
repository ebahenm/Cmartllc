const router             = require('express').Router();
const { getFareEstimate } = require('../controllers/pricingController');

// GET /api/pricing?pickupLocation=…&dropoffLocation=…&vehicleType=…
router.get('/', getFareEstimate);

module.exports = router;
