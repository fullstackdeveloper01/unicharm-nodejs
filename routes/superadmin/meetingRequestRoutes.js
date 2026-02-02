const express = require('express');
const router = express.Router();
const meetingRequestController = require('../../controllers/superadmin/meetingRequestController');

router.get('/', meetingRequestController.getAllRequests);
router.get('/:id', meetingRequestController.getRequestById);
router.post('/', meetingRequestController.createRequest);
router.put('/:id', meetingRequestController.updateRequest);
router.delete('/:id', meetingRequestController.deleteRequest);

module.exports = router;
