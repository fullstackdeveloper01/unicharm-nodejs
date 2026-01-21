const service = require('../services/accountantService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllAccountants = async (req, res) => {
  try {
    const data = await service.getAllAccountants();
    sendResponse(res, true, 'Accountants retrieved', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getAccountantById = async (req, res) => {
  try {
    const data = await service.getAccountantById(req.params.id);
    if (!data) return sendResponse(res, false, 'Not found');
    sendResponse(res, true, 'Accountant retrieved', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createAccountant = async (req, res) => {
  try {
    const data = await service.createAccountant(req.body);
    res.status(201);
    sendResponse(res, true, 'Accountant created', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateAccountant = async (req, res) => {
  try {
    const item = await service.getAccountantById(req.params.id);
    if (!item) return sendResponse(res, false, 'Not found');
    const data = await service.updateAccountant(item, req.body);
    sendResponse(res, true, 'Accountant updated', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteAccountant = async (req, res) => {
  try {
    const item = await service.getAccountantById(req.params.id);
    if (!item) return sendResponse(res, false, 'Not found');
    await service.deleteAccountant(item);
    sendResponse(res, true, 'Accountant deleted');
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
