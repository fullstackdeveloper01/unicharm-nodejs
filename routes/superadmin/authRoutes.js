const express = require('express');
const router = express.Router();
const authController = require('../../controllers/superadmin/authController');
const { verifyToken } = require('../middleware/authMiddleware');
// Admin middleware can be used on protected routes, not on login itself usually.

router.options('/login', (req, res) => {
    res.sendStatus(200);
});

router.post('/login', authController.login);

// Example protected route
router.get('/me', verifyToken, (req, res) => {
    res.json({ success: true, message: 'You are authenticated', user: req.user });
});

module.exports = router;
