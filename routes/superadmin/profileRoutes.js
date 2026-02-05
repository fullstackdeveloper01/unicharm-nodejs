const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/superadmin/profileController');

// Routes for SuperAdmin Profile
router.get('/', profileController.getProfile);
router.post('/update', profileController.uploadMiddleware, profileController.updateProfile);
router.put('/update', profileController.uploadMiddleware, profileController.updateProfile); // Alias for PUT
router.put('/', profileController.uploadMiddleware, profileController.updateProfile); // Alias for RESTful update
router.post('/change-password', profileController.changePassword);

module.exports = router;
