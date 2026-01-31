const express = require('express');
const router = express.Router();
const corporatePricePolicyController = require('../../controllers/superAdmin/corporatePricePolicy.controller.js');

// CRUD routes
router.get('/', corporatePricePolicyController.getAllCorporatePricePolicies);
router.get('/:id', corporatePricePolicyController.getCorporatePricePolicyById);
router.post('/', corporatePricePolicyController.createCorporatePricePolicy);
router.put('/:id', corporatePricePolicyController.updateCorporatePricePolicy);
router.delete('/:id', corporatePricePolicyController.deleteCorporatePricePolicy);

module.exports = router;
