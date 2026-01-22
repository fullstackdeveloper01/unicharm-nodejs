const express = require('express');
const router = express.Router();
const salesPricePolicyController = require('../controllers/salesPricePolicyController');

// CRUD routes
router.get('/', salesPricePolicyController.getAllSalesPricePolicies);
router.get('/:id', salesPricePolicyController.getSalesPricePolicyById);
router.post('/', salesPricePolicyController.createSalesPricePolicy);
router.put('/:id', salesPricePolicyController.updateSalesPricePolicy);
router.delete('/:id', salesPricePolicyController.deleteSalesPricePolicy);

module.exports = router;
