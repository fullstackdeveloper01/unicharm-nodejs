const service = require('../services/currencyMasterService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllCurrencies = async (req, res) => {
    try {
        const data = await service.getAllCurrencies();
        sendResponse(res, true, 'Currencies retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getCurrencyById = async (req, res) => {
    try {
        const data = await service.getCurrencyById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Currency retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCurrency = async (req, res) => {
    try {
        const data = await service.createCurrency(req.body);
        res.status(201);
        sendResponse(res, true, 'Currency created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCurrency = async (req, res) => {
    try {
        const item = await service.getCurrencyById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await service.updateCurrency(item, req.body);
        sendResponse(res, true, 'Currency updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCurrency = async (req, res) => {
    try {
        const item = await service.getCurrencyById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteCurrency(item);
        sendResponse(res, true, 'Currency deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
