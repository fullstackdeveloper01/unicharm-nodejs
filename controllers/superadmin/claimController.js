const service = require('../../services/superadmin/claimService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllClaims = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await service.getAllClaims(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Claims retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getClaimById = async (req, res) => {
    try {
        const data = await service.getClaimById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Claim retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createClaim = async (req, res) => {
    try {
        const data = await service.createClaim(req.body);
        res.status(201);
        sendResponse(res, true, 'Claim created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateClaim = async (req, res) => {
    try {
        const item = await service.getClaimById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateClaim(item, req.body);
        sendResponse(res, true, 'Claim updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteClaim = async (req, res) => {
    try {
        const item = await service.getClaimById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteClaim(item);
        sendResponse(res, true, 'Claim deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
