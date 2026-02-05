const service = require('../../services/superadmin/cityService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await service.getAllCities(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Cities retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getCityById = async (req, res) => {
    try {
        const data = await service.getCityById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'City retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCity = async (req, res) => {
    try {
        const data = await service.createCity(req.body);
        res.status(201);
        sendResponse(res, true, 'City created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCity = async (req, res) => {
    try {
        const item = await service.getCityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateCity(item, req.body);
        sendResponse(res, true, 'City updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCity = async (req, res) => {
    try {
        const item = await service.getCityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteCity(item);
        sendResponse(res, true, 'City deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
