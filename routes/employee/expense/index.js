const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/employee/expense/auth.middleware.js');

const claimRoutes = require('./claim.routes.js');
const expenseLocationRoutes = require('./expenseLocation.routes.js');

// Middleware
router.use(verifyToken);

// Routes
router.use('/claims', claimRoutes);
router.use('/expenseLocations', expenseLocationRoutes);

module.exports = router;
