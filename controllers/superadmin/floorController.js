const floorService = require('../../services/superadmin/floorService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllFloors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await floorService.getAllFloors(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Floors retrieved', result.rows, null, pagination);
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
