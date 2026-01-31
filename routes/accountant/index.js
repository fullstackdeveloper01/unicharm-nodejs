const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/accountant/auth.middleware.js');

const accountantRoutes = require('./accountant.routes.js');

// Middleware
router.use(verifyToken);

// Routes
router.use('/accountants', accountantRoutes);

module.exports = router;
