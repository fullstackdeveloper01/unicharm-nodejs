const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
// Admin middleware can be used on protected routes, not on login itself usually.

router.options('/login', (req, res) => {
    res.sendStatus(200);
});

router.post('/login', authController.login);

// Example protected route
router.get('/me', authMiddleware, (req, res) => {
    res.json({ success: true, message: 'You are authenticated', user: req.user });
});

module.exports = router;
