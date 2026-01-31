const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/employee/intra/auth.controller.js');
const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-birth-year', verifyToken, authController.verifyBirthYear);

module.exports = router;
