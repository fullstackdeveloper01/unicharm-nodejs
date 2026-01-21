const locationService = require('../services/locationService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllLocations = async (req, res) => {
    try {
        const data = await locationService.getAllLocations();
        sendResponse(res, true, 'Locations retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getLocationById = async (req, res) => {
    try {
        const data = await locationService.getLocationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Location retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createLocation = async (req, res) => {
    try {
        const data = await locationService.createLocation(req.body);
        res.status(201);
        sendResponse(res, true, 'Location created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateLocation = async (req, res) => {
    try {
        const item = await locationService.getLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await locationService.updateLocation(item, req.body);
        sendResponse(res, true, 'Location updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteLocation = async (req, res) => {
    try {
        const item = await locationService.getLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await locationService.deleteLocation(item);
        sendResponse(res, true, 'Location deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
