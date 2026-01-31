
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Accountant } = require('../../models/accountant');
const { Employee } = require('../../models/superAdmin');



const getAllAccountants = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };
    if (search) whereClause.Name = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        include: [{ model: Employee, as: 'employee' }],
        order: [['Id', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Accountant.findAndCountAll(queryOptions);
};
const getAccountantById = async (id) => Accountant.findByPk(id, { include: [{ model: Employee, as: 'employee' }] });
const createAccountant = async (data) => Accountant.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateAccountant = async (item, data) => item.update(data);
const deleteAccountant = async (item) => item.update({ IsDeleted: true });

// -----------------------------

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

    const result = await getAllAccountants(page, limit, search);

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
    const data = await getAccountantById(req.params.id);
    if (!data) return sendResponse(res, false, 'Not found');
    sendResponse(res, true, 'Accountant retrieved', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createAccountant = async (req, res) => {
  try {
    const data = await createAccountant(req.body);
    res.status(201);
    sendResponse(res, true, 'Accountant created', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateAccountant = async (req, res) => {
  try {
    const item = await getAccountantById(req.params.id);
    if (!item) return sendResponse(res, false, 'Not found');
    const data = await updateAccountant(item, req.body);
    sendResponse(res, true, 'Accountant updated', data);
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteAccountant = async (req, res) => {
  try {
    const item = await getAccountantById(req.params.id);
    if (!item) return sendResponse(res, false, 'Not found');
    await deleteAccountant(item);
    sendResponse(res, true, 'Accountant deleted');
  } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
