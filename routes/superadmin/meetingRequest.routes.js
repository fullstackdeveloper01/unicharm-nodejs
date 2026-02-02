const express = require('express');
const router = express.Router();
const meetingRequestController = require('../../controllers/superadmin/meetingRequest.controller');

const { verifyToken } = require('../../middlewares/shared/auth');

// GET meeting requests list with pagination & search
router.get('/', verifyToken, meetingRequestController.getMeetingRequests);

// PUT update meeting request
router.put('/:id', meetingRequestController.updateMeetingRequest);

// DELETE meeting request
router.delete('/:id', meetingRequestController.deleteMeetingRequest);

module.exports = router;
