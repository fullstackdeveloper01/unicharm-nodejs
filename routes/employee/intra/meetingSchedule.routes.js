const express = require('express');
const router = express.Router();
const meetingScheduleController = require('../../../controllers/employee/intra/meetingSchedule.controller.js');

// GET Location List
router.get('/locations', meetingScheduleController.getLocations);

// GET Floor List
router.get('/floors', meetingScheduleController.getFloors);

// GET Room List
router.get('/rooms', meetingScheduleController.getRooms);

// GET Calendar Schedule
router.get('/calendar', meetingScheduleController.getSchedule);

module.exports = router;
