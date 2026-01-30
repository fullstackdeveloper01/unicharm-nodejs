const meetingRequestService = require('../services/meetingRequestService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await meetingRequestService.getAllRequests(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Requests retrieved', result.rows, null, pagination);
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
