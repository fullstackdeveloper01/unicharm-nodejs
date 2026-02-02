const express = require('express');
const router = express.Router();
const loginDetailController = require('../../controllers/superadmin/loginDetailController');

// Login Detail routes
router.get('/', loginDetailController.getAllLoginDetails);
router.get('/:id', loginDetailController.getLoginDetailById);

module.exports = router;
