const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

const authRoutes = require('./auth.routes.js');
const holidayRoutes = require('./holiday.routes.js');
const homeRoutes = require('./home.routes.js');
const meetingBookingRoutes = require('./meetingBooking.routes.js');
const meetingNotificationRoutes = require('./meetingNotification.routes.js');
const meetingRequestRoutes = require('./meetingRequest.routes.js');
const meetingScheduleRoutes = require('./meetingSchedule.routes.js');
const policyRoutes = require('./policy.routes.js');
const profileRoutes = require('./profile.routes.js');
const ticketRoutes = require('./ticket.routes.js');
const wallRoutes = require('./wall.routes.js');
const wishRoutes = require('./wish.routes.js');

// Middleware
router.use(verifyToken);

// Routes
router.use('/auth', authRoutes);
router.use('/holidaies', holidayRoutes);
router.use('/home', homeRoutes);
router.use('/meetingBookings', meetingBookingRoutes);
router.use('/meetingNotifications', meetingNotificationRoutes);
router.use('/meetingRequests', meetingRequestRoutes);
router.use('/meetingSchedules', meetingScheduleRoutes);
router.use('/policies', policyRoutes);
router.use('/profiles', profileRoutes);
router.use('/tickets', ticketRoutes);
router.use('/walls', wallRoutes);
router.use('/wishs', wishRoutes);

module.exports = router;
