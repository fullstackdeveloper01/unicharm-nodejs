
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { MeetingNotification } = require('../../../models/employee/intra');




const getAllNotifications = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        include: [{
            model: db.Employee,
            as: 'employee',
            attributes: ['Id', 'FirstName', 'LastName', 'EmpId']
        }],
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await MeetingNotification.findAndCountAll(queryOptions);
};

const getNotificationById = async (id) => {
    return await MeetingNotification.findByPk(id);
};

const createNotification = async (data) => {
    return await MeetingNotification.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

const updateNotification = async (notification, data) => {
    return await notification.update(data);
};

const deleteNotification = async (notification) => {
    return await notification.update({ IsDeleted: true });
};

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const { count, rows } = await getAllNotifications(page, limit);

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
        const data = await getNotificationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Notification retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createNotification = async (req, res) => {
    try {
        const data = await createNotification(req.body);
        res.status(201);
        sendResponse(res, true, 'Notification created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateNotification = async (req, res) => {
    try {
        const item = await getNotificationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateNotification(item, req.body);
        sendResponse(res, true, 'Notification updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteNotification = async (req, res) => {
    try {
        const item = await getNotificationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteNotification(item);
        sendResponse(res, true, 'Notification deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
