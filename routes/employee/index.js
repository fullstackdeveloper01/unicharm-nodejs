const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const homeRoutes = require('./home.routes');
const profileRoutes = require('./profile.routes');
const holidayRoutes = require('./holiday.routes');
const wallRoutes = require('./wall.routes');
const wishRoutes = require('./wish.routes');
const policyRoutes = require('./policy.routes');
const ticketRoutes = require('./ticket.routes');

const { verifyToken } = require('../../middlewares/shared/auth');

router.use('/auth', authRoutes);

// Protect all routes below this line
router.use(verifyToken);
router.use('/home', homeRoutes);
router.use('/profile', profileRoutes);
router.use('/holidays', holidayRoutes);
router.use('/walls', wallRoutes);
router.use('/wishes', wishRoutes);
router.use('/policies', policyRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
