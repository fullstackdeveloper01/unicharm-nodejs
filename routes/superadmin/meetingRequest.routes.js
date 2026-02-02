const express = require('express');
const router = express.Router();
const meetingRequestController = require('../../controllers/superadmin/meetingRequestController');

const { verifyToken } = require('../../middlewares/shared/auth');

// GET meeting requests list with pagination & search
router.get('/', verifyToken, meetingRequestController.getAllRequests);

// PUT update meeting request
router.put('/:id', meetingRequestController.updateRequest);

// DELETE meeting request
router.delete('/:id', meetingRequestController.deleteRequest);

module.exports = router;
