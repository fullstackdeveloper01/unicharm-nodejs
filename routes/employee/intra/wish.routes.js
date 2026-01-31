const express = require('express');
const router = express.Router();
const wishController = require('../../../controllers/employee/intra/wish.controller.js');
const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

// Routes
router.post('/send', verifyToken, wishController.sendWish);
router.get('/:userId', verifyToken, wishController.getWishes);

module.exports = router;
