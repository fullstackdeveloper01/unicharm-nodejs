const service = require('../services/accountantService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
  const response = { success, message, data, errors };
  if (pagination) response.pagination = pagination;
  res.json(response);
};

exports.getAllAccountants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const search = req.query.search || '';

    const result = await service.getAllAccountants(page, limit, search);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Accountants retrieved', result.rows, null, pagination);
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
