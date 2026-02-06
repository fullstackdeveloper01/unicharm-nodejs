const meetingNotificationService = require('../../services/superadmin/meetingNotificationService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const { count, rows } = await meetingNotificationService.getAllNotifications(page, limit, search);

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
        const data = { ...req.body };

        // Map userId -> UserId
        if (req.body.userId || req.body.UserId) {
            data.UserId = req.body.userId || req.body.UserId;
        }

        if (!data.UserId) {
            return sendResponse(res, false, 'User selection is required');
        }

        const notification = await meetingNotificationService.createNotification(data);
        res.status(201);
        sendResponse(res, true, 'Notification created', notification);
    } catch (e) {
        sendResponse(res, false, 'Failed', null, { message: e.message });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const item = await meetingNotificationService.getNotificationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');

        const data = { ...req.body };
        // Map userId -> UserId
        if (req.body.userId || req.body.UserId) {
            data.UserId = req.body.userId || req.body.UserId;
        }

        const updated = await meetingNotificationService.updateNotification(item, data);
        sendResponse(res, true, 'Notification updated', updated);
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
