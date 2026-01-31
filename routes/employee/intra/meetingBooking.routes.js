const express = require('express');
const router = express.Router();
const meetingBookingController = require('../../../controllers/employee/intra/meetingBooking.controller.js');

const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

// POST Create New Booking
router.post('/', verifyToken, meetingBookingController.createBooking);

module.exports = router;
