const service = require('../services/cityService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllCities = async (req, res) => {
    try {
        const data = await service.getAllCities();
        sendResponse(res, true, 'Cities retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getCityById = async (req, res) => {
    try {
        const data = await service.getCityById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'City retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCity = async (req, res) => {
    try {
        const data = await service.createCity(req.body);
        res.status(201);
        sendResponse(res, true, 'City created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCity = async (req, res) => {
    try {
        const item = await service.getCityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateCity(item, req.body);
        sendResponse(res, true, 'City updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCity = async (req, res) => {
    try {
        const item = await service.getCityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteCity(item);
        sendResponse(res, true, 'City deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
