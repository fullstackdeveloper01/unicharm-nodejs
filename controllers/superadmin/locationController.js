const locationService = require('../../services/superadmin/locationService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllLocations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const zoneId = req.query.zoneId ? parseInt(req.query.zoneId) : null;
        const search = req.query.search || '';

        const result = await locationService.getAllLocations(page, limit, zoneId, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Locations retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getLocationById = async (req, res) => {
    try {
        const data = await locationService.getLocationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Location retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createLocation = async (req, res) => {
    try {
        const data = await locationService.createLocation(req.body);
        res.status(201);
        sendResponse(res, true, 'Location created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateLocation = async (req, res) => {
    try {
        const item = await locationService.getLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await locationService.updateLocation(item, req.body);
        sendResponse(res, true, 'Location updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteLocation = async (req, res) => {
    try {
        const item = await locationService.getLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await locationService.deleteLocation(item);
        sendResponse(res, true, 'Location deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
