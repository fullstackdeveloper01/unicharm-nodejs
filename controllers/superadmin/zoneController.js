const service = require('../../services/superadmin/zoneService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllZones = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const unitId = req.query.unitId ? parseInt(req.query.unitId) : null;
        const search = req.query.search || '';

        const result = await service.getAllZones(page, limit, unitId, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Zones retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getZoneById = async (req, res) => {
    try {
        const data = await service.getZoneById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Zone retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createZone = async (req, res) => {
    try {
        const data = await service.createZone(req.body);
        res.status(201);
        sendResponse(res, true, 'Zone created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateZone = async (req, res) => {
    try {
        const item = await service.getZoneById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateZone(item, req.body);
        sendResponse(res, true, 'Zone updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteZone = async (req, res) => {
    try {
        const item = await service.getZoneById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteZone(item);
        sendResponse(res, true, 'Zone deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
