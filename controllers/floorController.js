const floorService = require('../services/floorService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllFloors = async (req, res) => {
    try {
        const data = await floorService.getAllFloors();
        sendResponse(res, true, 'Floors retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getFloorById = async (req, res) => {
    try {
        const data = await floorService.getFloorById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Floor retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createFloor = async (req, res) => {
    try {
        const data = await floorService.createFloor(req.body);
        res.status(201);
        sendResponse(res, true, 'Floor created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateFloor = async (req, res) => {
    try {
        const item = await floorService.getFloorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await floorService.updateFloor(item, req.body);
        sendResponse(res, true, 'Floor updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteFloor = async (req, res) => {
    try {
        const item = await floorService.getFloorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await floorService.deleteFloor(item);
        sendResponse(res, true, 'Floor deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getFloorsDropdown = async (req, res) => {
    try {
        const data = await floorService.getFloorsDropdown();
        sendResponse(res, true, 'Floors retrieved for dropdown', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
