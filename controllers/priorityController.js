const service = require('../services/priorityService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllPriorities = async (req, res) => {
    try {
        const data = await service.getAllPriorities();
        sendResponse(res, true, 'Priorities retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getPriorityById = async (req, res) => {
    try {
        const data = await service.getPriorityById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Priority retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createPriority = async (req, res) => {
    try {
        const data = await service.createPriority(req.body);
        res.status(201);
        sendResponse(res, true, 'Priority created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updatePriority = async (req, res) => {
    try {
        const item = await service.getPriorityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updatePriority(item, req.body);
        sendResponse(res, true, 'Priority updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deletePriority = async (req, res) => {
    try {
        const item = await service.getPriorityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deletePriority(item);
        sendResponse(res, true, 'Priority deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
