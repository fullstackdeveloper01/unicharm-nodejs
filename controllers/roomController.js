const roomService = require('../services/roomService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllRooms = async (req, res) => {
    try {
        const data = await roomService.getAllRooms();
        sendResponse(res, true, 'Rooms retrieved', data);
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
