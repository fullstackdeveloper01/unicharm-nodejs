const service = require('../services/auditorService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllAuditors = async (req, res) => {
    try {
        const data = await service.getAllAuditors();
        sendResponse(res, true, 'Auditors retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getAuditorById = async (req, res) => {
    try {
        const data = await service.getAuditorById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Auditor retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createAuditor = async (req, res) => {
    try {
        const data = await service.createAuditor(req.body);
        res.status(201);
        sendResponse(res, true, 'Auditor created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateAuditor = async (req, res) => {
    try {
        const item = await service.getAuditorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateAuditor(item, req.body);
        sendResponse(res, true, 'Auditor updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteAuditor = async (req, res) => {
    try {
        const item = await service.getAuditorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteAuditor(item);
        sendResponse(res, true, 'Auditor deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
