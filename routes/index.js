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
const employeeAppRoutes = require('./employee/index');

const { verifyToken } = require('../middleware/authMiddleware');

// Public routes (No Token Required)
router.use('/auth', require('./authRoutes'));

// Root API route
router.get('/', (req, res) => {
  res.json({
    message: 'EMS Admin API',
    version: '1.0.0',
    endpoints: {
      employees: '/api/employees',
      departments: '/api/departments',
      health: '/api/health'
    }
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EMS Admin API is running',
    timestamp: new Date().toISOString()
  });
});

// Alias for /signin in api route (e.g., /api/signin)
router.all('/signin', (req, res) => {
  res.redirect(307, '/api/auth/login');
});

// Protected Routes (Token Required)
router.use(verifyToken);

// API routes
router.use('/employees', employeeRoutes);
router.use('/employee', employeeAppRoutes);
router.use(['/departments', '/department'], departmentRoutes);
router.use(['/designations', '/designation'], designationRoutes);
router.use(['/roles', '/role'], roleRoutes);
router.use(['/accountants', '/accountant'], accountantRoutes);
router.use('/home', homeRoutes);
router.use(['/tickets', '/ticket'], ticketRoutes);
router.use(['/walls', '/wall'], require('./wallRoutes'));
router.use(['/notices', '/notice'], require('./noticeRoutes'));
router.use(['/policies', '/policy'], require('./policyRoutes'));
router.use(['/holidays', '/holiday'], require('./holidayRoutes'));
router.use(['/products', '/product'], require('./productRoutes'));
router.use(['/quotes', '/quote'], require('./quoteRoutes'));
router.use(['/chorei-messages', '/chorei-message'], require('./choreiMessageRoutes'));
router.use(['/news', '/news-item'], require('./newsRoutes'));
router.use(['/events', '/event'], require('./eventRoutes'));
router.use(['/photo-galleries', '/photo-gallery'], require('./photoGalleryRoutes'));
router.use(['/slider-images', '/slider-image'], require('./sliderImageRoutes'));
router.use(['/popup-images', '/popup-image'], require('./popupImageRoutes'));
router.use(['/login-details', '/login-detail'], require('./loginDetailRoutes'));
router.use(['/sales-price-policies', '/sales-price-policy', '/salespricepolicies'], require('./salesPricePolicyRoutes'));
router.use(['/corporate-price-policies', '/corporate-price-policy', '/corporatepricepolicies'], require('./corporatePricePolicyRoutes'));
router.use(['/emergency-response', '/emergency-response-network'], require('./emergencyResponseRoutes'));
router.use(['/expense-locations', '/expense-location'], require('./expenseLocationRoutes'));
router.use(['/locations', '/location'], require('./locationRoutes'));
router.use(['/floors', '/floor'], require('./floorRoutes'));
router.use(['/rooms', '/room'], require('./roomRoutes'));
router.use(['/meeting-notifications', '/meeting-notification'], require('./meetingNotificationRoutes'));
router.use(['/meeting-requests', '/meeting-request'], require('./meetingRequest.routes'));
router.use('/meeting-booking', require('./meetingBooking.routes'));
router.use('/meeting-schedule', require('./meetingSchedule.routes'));
router.use(['/groups', '/group'], require('./groupRoutes'));
router.use(['/categories', '/category'], require('./categoryRoutes'));
router.use(['/priorities', '/priority'], require('./priorityRoutes'));
router.use(['/cities', '/city'], require('./cityRoutes'));
router.use(['/auditors', '/auditor'], require('./auditorRoutes'));
// router.use('/accountants', require('./accountantRoutes')); // duplicate already imported
router.use(['/units', '/unit'], require('./unitRoutes'));
router.use(['/zones', '/zone'], require('./zoneRoutes'));
router.use(['/currencies', '/currency'], require('./currencyMasterRoutes'));
router.use(['/claims', '/claim'], require('./claimRoutes'));
router.use(['/messages', '/message'], require('./messageRoutes'));


module.exports = router;
