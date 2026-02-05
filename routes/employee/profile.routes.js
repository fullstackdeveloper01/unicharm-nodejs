const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/employee/profile.controller');
const { verifyToken } = require('../../middlewares/shared/auth');

// All routes require authentication
router.use(verifyToken);

router.get('/', profileController.getProfile);
router.post('/update', profileController.uploadMiddleware, profileController.updateProfile);
router.put('/update', profileController.uploadMiddleware, profileController.updateProfile);
router.patch('/update', profileController.uploadMiddleware, profileController.updateProfile);

// Root path handlers
router.post('/', profileController.uploadMiddleware, profileController.updateProfile);
router.put('/', profileController.uploadMiddleware, profileController.updateProfile);
router.patch('/', profileController.uploadMiddleware, profileController.updateProfile);
router.post('/change-password', profileController.changePassword);

module.exports = router;
