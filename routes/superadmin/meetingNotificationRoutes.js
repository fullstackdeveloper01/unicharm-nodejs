const express = require('express');
const router = express.Router();
const meetingNotificationController = require('../../controllers/superadmin/meetingNotificationController');

router.get('/', meetingNotificationController.getAllNotifications);
router.get('/:id', meetingNotificationController.getNotificationById);
router.post('/', meetingNotificationController.createNotification);
router.put('/:id', meetingNotificationController.updateNotification);
router.delete('/:id', meetingNotificationController.deleteNotification);

module.exports = router;
