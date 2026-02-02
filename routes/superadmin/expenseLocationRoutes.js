const express = require('express');
const router = express.Router();
const expenseLocationController = require('../controllers/expenseLocationController');

router.get('/', expenseLocationController.getAllExpenseLocations);
router.get('/:id', expenseLocationController.getExpenseLocationById);
router.post('/', expenseLocationController.createExpenseLocation);
router.put('/:id', expenseLocationController.updateExpenseLocation);
router.delete('/:id', expenseLocationController.deleteExpenseLocation);

module.exports = router;
