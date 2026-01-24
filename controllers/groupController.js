const service = require('../services/groupService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllGroups = async (req, res) => {
    try {
        const data = await service.getAllGroups();
        sendResponse(res, true, 'Groups retrieved', data);
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
