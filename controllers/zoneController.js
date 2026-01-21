const service = require('../services/zoneService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllZones = async (req, res) => {
    try {
        const data = await service.getAllZones();
        sendResponse(res, true, 'Zones retrieved', data);
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
