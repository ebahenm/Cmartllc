// server/routes/vehicles.js
const express = require('express');
const router  = express.Router();
const {
  listVehicles,
  getVehicle,
  updateVehicleStatus
} = require('../controllers/vehicleController');

// GET    /api/vehicles
router.get('/', listVehicles);

// GET    /api/vehicles/:vehicleId
router.get('/:vehicleId', getVehicle);

// PATCH  /api/vehicles/:vehicleId/status
router.patch('/:vehicleId/status', updateVehicleStatus);

module.exports = router;
