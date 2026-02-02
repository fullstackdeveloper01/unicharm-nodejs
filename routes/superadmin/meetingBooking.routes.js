const express = require('express');
const router = express.Router();
const meetingBookingController = require('../../controllers/superadmin/meetingBooking.controller');

const { verifyToken } = require('../../middlewares/shared/auth');

// POST Create New Booking
router.post('/', verifyToken, meetingBookingController.createBooking);

module.exports = router;
