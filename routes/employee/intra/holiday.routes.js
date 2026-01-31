const express = require('express');
const router = express.Router();
const holidayController = require('../../../controllers/employee/intra/holiday.controller.js');
const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

router.use(verifyToken);

router.get('/', holidayController.getHolidays);

module.exports = router;
