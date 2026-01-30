const express = require('express');
const router = express.Router();
const wishController = require('../../controllers/employee/wish.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Routes
router.post('/send', verifyToken, wishController.sendWish);
router.get('/:userId', verifyToken, wishController.getWishes);

module.exports = router;
