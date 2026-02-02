const roomService = require('../../services/superadmin/roomService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllRooms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await roomService.getAllRooms(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Rooms retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getRoomById = async (req, res) => {
    try {
        const data = await roomService.getRoomById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Room retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createRoom = async (req, res) => {
    try {
        const data = await roomService.createRoom(req.body);
        res.status(201);
        sendResponse(res, true, 'Room created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateRoom = async (req, res) => {
    try {
        const item = await roomService.getRoomById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await roomService.updateRoom(item, req.body);
        sendResponse(res, true, 'Room updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteRoom = async (req, res) => {
    try {
        const item = await roomService.getRoomById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await roomService.deleteRoom(item);
        sendResponse(res, true, 'Room deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
