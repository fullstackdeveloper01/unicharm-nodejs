const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auditor/auth.middleware.js');

const auditorRoutes = require('./auditor.routes.js');

// Middleware
router.use(verifyToken);

// Routes
router.use('/auditors', auditorRoutes);

module.exports = router;
