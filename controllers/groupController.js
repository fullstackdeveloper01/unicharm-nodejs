const service = require('../services/groupService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllGroups = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await service.getAllGroups(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Groups retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getGroupById = async (req, res) => {
    try {
        const item = await service.getGroupById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');

        const data = item.get({ plain: true });
        try { data.Members = JSON.parse(data.Members || '[]'); } catch (e) { data.Members = []; }

        sendResponse(res, true, 'Group retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createGroup = async (req, res) => {
    try {
        const data = await service.createGroup(req.body);
        res.status(201);
        sendResponse(res, true, 'Group created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateGroup = async (req, res) => {
    try {
        const item = await service.getGroupById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateGroup(item, req.body);
        sendResponse(res, true, 'Group updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteGroup = async (req, res) => {
    try {
        const item = await service.getGroupById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteGroup(item);
        sendResponse(res, true, 'Group deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
