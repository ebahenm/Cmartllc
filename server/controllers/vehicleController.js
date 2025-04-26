// server/controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');

exports.listVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort('type');
    res.json({ vehicles });
  } catch (err) {
    console.error('listVehicles error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ vehicle });
  } catch (err) {
    console.error('getVehicle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.vehicleId,
      { status },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Status updated', vehicle });
  } catch (err) {
    console.error('updateVehicleStatus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
