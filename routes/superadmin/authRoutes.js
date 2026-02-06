const express = require('express');
const router = express.Router();
const authController = require('../../controllers/superadmin/authController');
const { verifyToken } = require('../../middlewares/shared/auth');
// Admin middleware can be used on protected routes, not on login itself usually.

router.options('/login', (req, res) => {
    res.sendStatus(200);
});

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Profile service for fetching full user details
const profileService = require('../../services/employee/profile.service');

// Protected /me route - supports both GET and POST
const meHandler = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        console.log('API /me: Fetching profile for user', userId);
        const userProfile = await profileService.getProfile(userId);

        // Return full user profile data
        const fullUser = {
            id: userId,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
            ...userProfile
        };

        res.json({ success: true, message: 'You are authenticated', user: fullUser });
    } catch (error) {
        console.error('API /me Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user details', error: error.message });
    }
};

router.get('/me', verifyToken, meHandler);
router.post('/me', verifyToken, meHandler);

// Profile update route under /auth
const profileController = require('../../controllers/superadmin/profileController');
router.post('/update-profile', verifyToken, profileController.uploadMiddleware, profileController.updateProfile);
router.put('/update-profile', verifyToken, profileController.uploadMiddleware, profileController.updateProfile);
router.patch('/update-profile', verifyToken, profileController.uploadMiddleware, profileController.updateProfile);

module.exports = router;
