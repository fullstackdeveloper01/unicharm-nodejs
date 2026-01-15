const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountantController');

// Accountant routes using stored procedures
router.get('/', accountantController.getAllAccountants);
router.get('/:id', accountantController.getAccountantById);

module.exports = router;
