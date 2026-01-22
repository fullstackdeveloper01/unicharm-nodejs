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
router.use('/walls', require('./wallRoutes'));
router.use('/notices', require('./noticeRoutes'));
router.use('/policies', require('./policyRoutes'));
router.use('/holidays', require('./holidayRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/quotes', require('./quoteRoutes'));
router.use('/chorei-messages', require('./choreiMessageRoutes'));
router.use('/news', require('./newsRoutes'));
router.use('/events', require('./eventRoutes'));
router.use('/photo-galleries', require('./photoGalleryRoutes'));
router.use('/slider-images', require('./sliderImageRoutes'));
router.use('/popup-images', require('./popupImageRoutes'));
router.use('/login-details', require('./loginDetailRoutes'));
router.use('/sales-price-policies', require('./salesPricePolicyRoutes'));
router.use('/expense-locations', require('./expenseLocationRoutes'));
router.use('/locations', require('./locationRoutes'));
router.use('/floors', require('./floorRoutes'));
router.use('/rooms', require('./roomRoutes'));
router.use('/meeting-notifications', require('./meetingNotificationRoutes'));
router.use('/meeting-requests', require('./meetingRequestRoutes'));
router.use('/groups', require('./groupRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/priorities', require('./priorityRoutes'));
router.use('/cities', require('./cityRoutes'));
router.use('/auditors', require('./auditorRoutes'));
router.use('/accountants', require('./accountantRoutes'));
router.use('/units', require('./unitRoutes'));
router.use('/zones', require('./zoneRoutes'));
router.use('/currencies', require('./currencyMasterRoutes'));
router.use('/claims', require('./claimRoutes'));
router.use('/messages', require('./messageRoutes'));

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EMS Admin API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
