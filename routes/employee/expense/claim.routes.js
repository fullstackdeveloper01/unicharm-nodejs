const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/employee/expense/claim.controller.js');

router.get('/', controller.getAllClaims);
router.get('/:id', controller.getClaimById);
router.post('/', controller.createClaim);
router.put('/:id', controller.updateClaim);
router.delete('/:id', controller.deleteClaim);

module.exports = router;
