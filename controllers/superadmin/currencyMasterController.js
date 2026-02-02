const service = require('../../services/superadmin/currencyMasterService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCurrencies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await service.getAllCurrencies(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Currencies retrieved', result.rows, null, pagination);
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
