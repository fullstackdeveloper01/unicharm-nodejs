const express = require('express');
const router = express.Router();
const policyController = require('../../../controllers/employee/intra/policy.controller.js');
const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

// Routes
router.get('/', verifyToken, policyController.getAllPolicies);
router.get('/:id', verifyToken, policyController.getPolicyById);

module.exports = router;
