const express = require('express');
const router = express.Router();
const policyController = require('../../controllers/employee/policy.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Routes
router.get('/', verifyToken, policyController.getAllPolicies);
router.get('/:id', verifyToken, policyController.getPolicyById);

module.exports = router;
