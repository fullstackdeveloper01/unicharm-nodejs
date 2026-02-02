const meetingNotificationService = require('../../services/superadmin/meetingNotificationService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const { count, rows } = await meetingNotificationService.getAllNotifications(page, limit);

        const pagination = {
            total: count,
            page: page,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1,
            hasNext: limit ? page * limit < count : false
        };

        res.json({
            success: true,
            message: 'Notifications retrieved',
            data: rows,
            pagination
        });
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
