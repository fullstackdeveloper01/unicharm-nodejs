const express = require('express');
const router = express.Router();

// Root API Message
router.get('/', (req, res) => {
  res.json({
    message: 'Unicharm Nodejs API',
    version: '1.0.0'
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Unicharm Nodejs API is running'
  });
});

// Portal Routes
// We mount them at root because the portal indexes define specific sub-routes like /employees
// However, to avoid collision, validation is needed.
// superAdmin index defines /employees. 
// If we mount it at '/', it becomes /api/employees. Correct.

router.use('/', require('./superAdmin'));
router.use('/employee/intra', require('./employee/intra')); // Wait, old index had /employee -> employeeAppRoutes
// BUT old employeeAppRoutes had /home, /profile. So /api/employee/home.
// My generated index for intra uses /home, /employees.
// So mounting at /employee/intra is likely correct for Namespacing, OR /employee.
// User's old index: router.use('/employee', employeeAppRoutes);
// So I will mount at /employee.

router.use('/employee/expense', require('./employee/expense'));
router.use('/accountant', require('./accountant'));
router.use('/auditor', require('./auditor'));

// Note: superAdmin routes were previously at root (/api/employees).
// So we mount superAdmin at '/'.
router.use('/', require('./superAdmin'));

module.exports = router;
