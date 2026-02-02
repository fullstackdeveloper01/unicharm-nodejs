const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountantController');

router.get('/', controller.getAllAccountants);
router.get('/:id', controller.getAccountantById);
router.post('/', controller.createAccountant);
router.put('/:id', controller.updateAccountant);
router.delete('/:id', controller.deleteAccountant);

module.exports = router;
