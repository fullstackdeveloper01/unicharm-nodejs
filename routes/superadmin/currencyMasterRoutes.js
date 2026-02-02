const express = require('express');
const router = express.Router();
const controller = require('../../controllers/superadmin/currencyMasterController');

router.get('/', controller.getAllCurrencies);
router.get('/:id', controller.getCurrencyById);
router.post('/', controller.createCurrency);
router.put('/:id', controller.updateCurrency);
router.delete('/:id', controller.deleteCurrency);

module.exports = router;
