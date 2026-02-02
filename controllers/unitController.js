const service = require('../services/unitService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllUnits = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await service.getAllUnits(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Units retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getUnitById = async (req, res) => {
    try {
        const data = await service.getUnitById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Unit retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createUnit = async (req, res) => {
    try {
        const data = await service.createUnit(req.body);
        res.status(201);
        sendResponse(res, true, 'Unit created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateUnit = async (req, res) => {
    try {
        const item = await service.getUnitById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateUnit(item, req.body);
        sendResponse(res, true, 'Unit updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteUnit = async (req, res) => {
    try {
        const item = await service.getUnitById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteUnit(item);
        sendResponse(res, true, 'Unit deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
