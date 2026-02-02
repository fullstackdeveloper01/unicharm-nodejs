const express = require('express');
const router = express.Router();
const authController = require('../../controllers/employee/auth.controller');
const { verifyToken } = require('../../middlewares/shared/auth');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-birth-year', verifyToken, authController.verifyBirthYear);

module.exports = router;
