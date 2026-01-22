const meetingNotificationService = require('../services/meetingNotificationService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllNotifications = async (req, res) => {
    try {
        const data = await meetingNotificationService.getAllNotifications();
        sendResponse(res, true, 'Notifications retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getNotificationById = async (req, res) => {
    try {
        const data = await meetingNotificationService.getNotificationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Notification retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createNotification = async (req, res) => {
    try {
        const data = await meetingNotificationService.createNotification(req.body);
        res.status(201);
        sendResponse(res, true, 'Notification created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateNotification = async (req, res) => {
    try {
        const item = await meetingNotificationService.getNotificationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await meetingNotificationService.updateNotification(item, req.body);
        sendResponse(res, true, 'Notification updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteNotification = async (req, res) => {
    try {
        const item = await meetingNotificationService.getNotificationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await meetingNotificationService.deleteNotification(item);
        sendResponse(res, true, 'Notification deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
