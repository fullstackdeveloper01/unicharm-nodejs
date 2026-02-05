const express = require('express');
const router = express.Router();
const authController = require('../../controllers/superadmin/authController');
const { verifyToken } = require('../../middlewares/shared/auth');
// Admin middleware can be used on protected routes, not on login itself usually.

router.options('/login', (req, res) => {
    res.sendStatus(200);
});

router.post('/login', authController.login);

// Example protected route
router.get('/me', verifyToken, (req, res) => {
    res.json({ success: true, message: 'You are authenticated', user: req.user });
});

// Profile update route under /auth
const profileController = require('../../controllers/superadmin/profileController');
router.post('/update-profile', verifyToken, profileController.uploadMiddleware, profileController.updateProfile);
router.put('/update-profile', verifyToken, profileController.uploadMiddleware, profileController.updateProfile);
router.patch('/update-profile', verifyToken, profileController.uploadMiddleware, profileController.updateProfile);

module.exports = router;
