const express = require('express');
const router = express.Router();
const holidayController = require('../../controllers/employee/holiday.controller');
const { verifyToken } = require('../../middlewares/shared/auth');

router.use(verifyToken);

router.get('/', holidayController.getHolidays);

module.exports = router;
