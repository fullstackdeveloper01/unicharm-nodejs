const expenseLocationService = require('../services/expenseLocationService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllExpenseLocations = async (req, res) => {
    try {
        const data = await expenseLocationService.getAllExpenseLocations();
        sendResponse(res, true, 'Expense Locations retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getExpenseLocationById = async (req, res) => {
    try {
        const data = await expenseLocationService.getExpenseLocationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Expense Location retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createExpenseLocation = async (req, res) => {
    try {
        const data = await expenseLocationService.createExpenseLocation(req.body);
        res.status(201);
        sendResponse(res, true, 'Expense Location created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateExpenseLocation = async (req, res) => {
    try {
        const item = await expenseLocationService.getExpenseLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await expenseLocationService.updateExpenseLocation(item, req.body);
        sendResponse(res, true, 'Expense Location updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteExpenseLocation = async (req, res) => {
    try {
        const item = await expenseLocationService.getExpenseLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await expenseLocationService.deleteExpenseLocation(item);
        sendResponse(res, true, 'Expense Location deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
