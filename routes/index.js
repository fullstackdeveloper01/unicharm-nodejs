const express = require('express');
const router = express.Router();

// Import route modules
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');
const designationRoutes = require('./designationRoutes');
const roleRoutes = require('./roleRoutes');
const accountantRoutes = require('./accountantRoutes');
const homeRoutes = require('./homeRoutes');
const ticketRoutes = require('./ticketRoutes');

// API routes
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/designations', designationRoutes);
router.use('/roles', roleRoutes);
router.use('/accountants', accountantRoutes);
router.use('/home', homeRoutes);
router.use('/tickets', ticketRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EMS Admin API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
