const meetingRequestService = require('../services/meetingRequestService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllRequests = async (req, res) => {
    try {
        const data = await meetingRequestService.getAllRequests();
        sendResponse(res, true, 'Requests retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getRequestById = async (req, res) => {
    try {
        const data = await meetingRequestService.getRequestById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Request retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createRequest = async (req, res) => {
    try {
        const data = await meetingRequestService.createRequest(req.body);
        res.status(201);
        sendResponse(res, true, 'Request created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateRequest = async (req, res) => {
    try {
        const item = await meetingRequestService.getRequestById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await meetingRequestService.updateRequest(item, req.body);
        sendResponse(res, true, 'Request updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteRequest = async (req, res) => {
    try {
        const item = await meetingRequestService.getRequestById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await meetingRequestService.deleteRequest(item);
        sendResponse(res, true, 'Request deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
