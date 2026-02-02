const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/employee/profile.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// All routes require authentication
router.use(verifyToken);

router.get('/', profileController.getProfile);
router.post('/update', profileController.uploadMiddleware, profileController.updateProfile);
router.post('/change-password', profileController.changePassword);

module.exports = router;
