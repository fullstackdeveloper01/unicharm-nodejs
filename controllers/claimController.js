const service = require('../services/claimService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllClaims = async (req, res) => {
    try {
        const data = await service.getAllClaims();
        sendResponse(res, true, 'Claims retrieved', data);
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
