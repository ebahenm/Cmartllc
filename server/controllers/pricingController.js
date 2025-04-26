//server/controllers/pricingController.js

const distanceCalculator = require('../utils/distanceCalculator');

// Define your per‐mile rates here
const RATES = {
  'Chevrolet Suburban 2023': 2.50,
  'Kia Sedona 2020'         : 2.00,
  default                   : 3.00
};

// GET /api/pricing?pickupLocation=…&dropoffLocation=…&vehicleType=…
exports.getFareEstimate = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, vehicleType } = req.query;
    if (!pickupLocation || !dropoffLocation || !vehicleType) {
      return res.status(400).json({
        error: 'pickupLocation, dropoffLocation and vehicleType are required'
      });
    }

    const distance = await distanceCalculator(pickupLocation, dropoffLocation);
    const rate     = RATES[vehicleType] ?? RATES.default;
    const fare     = parseFloat((distance * rate).toFixed(2));

    res.json({ distance, rate, fare });
  } catch (err) {
    console.error('pricingController.getFareEstimate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
