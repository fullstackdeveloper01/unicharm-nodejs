const express = require('express');
const router = express.Router();

// Import route modules
const employeeRoutes = require('./superadmin/employeeRoutes');
const departmentRoutes = require('./superadmin/departmentRoutes');
const designationRoutes = require('./superadmin/designationRoutes');
const roleRoutes = require('./superadmin/roleRoutes');
const accountantRoutes = require('./superadmin/accountantRoutes');
const homeRoutes = require('./superadmin/homeRoutes');
const ticketRoutes = require('./superadmin/ticketRoutes');
const employeeAppRoutes = require('./employee/index');

const { verifyToken } = require('../middlewares/shared/auth');

// Public routes (No Token Required)
router.use('/auth', require('./superadmin/authRoutes'));

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

// Employee App Routes (Partial public access handled inside)
router.use('/employee', employeeAppRoutes);

// Protected Routes (Token Required)
router.use(verifyToken);

// API routes
router.use('/employees', employeeRoutes);

router.use(['/departments', '/department'], departmentRoutes);
router.use(['/designations', '/designation'], designationRoutes);
router.use(['/roles', '/role'], roleRoutes);
router.use(['/accountants', '/accountant'], accountantRoutes);
router.use('/home', homeRoutes);
router.use(['/tickets', '/ticket'], ticketRoutes);
router.use(['/walls', '/wall'], require('./superadmin/wallRoutes'));
router.use(['/notices', '/notice'], require('./superadmin/noticeRoutes'));
router.use(['/policies', '/policy'], require('./superadmin/policyRoutes'));
router.use(['/holidays', '/holiday'], require('./superadmin/holidayRoutes'));
router.use(['/products', '/product'], require('./superadmin/productRoutes'));
router.use(['/quotes', '/quote'], require('./superadmin/quoteRoutes'));
router.use(['/chorei-messages', '/chorei-message'], require('./superadmin/choreiMessageRoutes'));
router.use(['/news', '/news-item'], require('./superadmin/newsRoutes'));
router.use(['/events', '/event'], require('./superadmin/eventRoutes'));
router.use(['/photo-galleries', '/photo-gallery'], require('./superadmin/photoGalleryRoutes'));
router.use(['/slider-images', '/slider-image'], require('./superadmin/sliderImageRoutes'));
router.use(['/popup-images', '/popup-image'], require('./superadmin/popupImageRoutes'));
router.use(['/login-details', '/login-detail'], require('./superadmin/loginDetailRoutes'));
router.use(['/sales-price-policies', '/sales-price-policy', '/salespricepolicies'], require('./superadmin/salesPricePolicyRoutes'));
router.use(['/corporate-price-policies', '/corporate-price-policy', '/corporatepricepolicies'], require('./superadmin/corporatePricePolicyRoutes'));
router.use(['/emergency-response', '/emergency-response-network'], require('./superadmin/emergencyResponseRoutes'));
router.use(['/expense-locations', '/expense-location'], require('./superadmin/expenseLocationRoutes'));
router.use(['/locations', '/location'], require('./superadmin/locationRoutes'));
router.use(['/floors', '/floor'], require('./superadmin/floorRoutes'));
router.use(['/rooms', '/room'], require('./superadmin/roomRoutes'));
router.use(['/meeting-notifications', '/meeting-notification'], require('./superadmin/meetingNotificationRoutes'));
router.use(['/meeting-requests', '/meeting-request'], require('./superadmin/meetingRequest.routes'));
router.use('/meeting-booking', require('./superadmin/meetingBooking.routes'));
router.use('/meeting-schedule', require('./superadmin/meetingSchedule.routes'));
router.use(['/groups', '/group'], require('./superadmin/groupRoutes'));
router.use(['/priorities', '/priority'], require('./superadmin/priorityRoutes'));
router.use(['/cities', '/city'], require('./superadmin/cityRoutes'));
router.use(['/auditors', '/auditor'], require('./superadmin/auditorRoutes'));
// router.use('/accountants', require('./superadmin/accountantRoutes')); // duplicate already imported
router.use(['/units', '/unit'], require('./superadmin/unitRoutes'));
router.use(['/zones', '/zone'], require('./superadmin/zoneRoutes'));
router.use(['/currencies', '/currency'], require('./superadmin/currencyMasterRoutes'));
router.use(['/claims', '/claim'], require('./superadmin/claimRoutes'));
router.use(['/messages', '/message'], require('./superadmin/messageRoutes'));
router.use(['/categories', '/category'], require('./superadmin/category.routes'));


module.exports = router;
