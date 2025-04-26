const router             = require('express').Router();
const { assignDriver }   = require('../controllers/assignmentController');

// POST /api/assignment
// body: { bookingId, driverId }
router.post('/', assignDriver);

module.exports = router;
