const express = require('express');
const router = express.Router();
const loginDetailController = require('../../controllers/superAdmin/loginDetail.controller.js');

// Login Detail routes
router.get('/', loginDetailController.getAllLoginDetails);
router.get('/:id', loginDetailController.getLoginDetailById);

module.exports = router;
