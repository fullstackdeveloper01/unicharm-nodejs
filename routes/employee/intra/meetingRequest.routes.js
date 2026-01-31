const express = require('express');
const router = express.Router();
const meetingRequestController = require('../../../controllers/employee/intra/meetingRequest.controller.js');

const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

// GET meeting requests list with pagination & search
router.get('/', verifyToken, meetingRequestController.getMeetingRequests);

// PUT update meeting request
router.put('/:id', meetingRequestController.updateMeetingRequest);

// DELETE meeting request
router.delete('/:id', meetingRequestController.deleteMeetingRequest);

module.exports = router;
