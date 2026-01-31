const express = require('express');
const router = express.Router();
const profileController = require('../../../controllers/employee/intra/profile.controller.js');
// verifyToken is already applied in index.js, no need to re-apply

router.get('/', profileController.getProfile);
router.post('/update', profileController.uploadMiddleware, profileController.updateProfile);
router.post('/change-password', profileController.changePassword);

module.exports = router;
