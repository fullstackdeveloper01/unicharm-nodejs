
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { ExpenseLocation } = require('../../../models/employee/expense');



const getAllExpenseLocations = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    // Treat invalid, 0, or negative limit as unlimited (null)
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const where = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        where.Title = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
        where,
        order: [['Id', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await ExpenseLocation.findAndCountAll(queryOptions);
};

const getExpenseLocationById = async (id) => {
    return await ExpenseLocation.findByPk(id);
};

const createExpenseLocation = async (data) => {
    return await ExpenseLocation.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

const updateExpenseLocation = async (location, data) => {
    return await location.update(data);
};

const deleteExpenseLocation = async (location) => {
    return await location.update({ IsDeleted: true });
};

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllExpenseLocations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllExpenseLocations(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Expense Locations retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getExpenseLocationById = async (req, res) => {
    try {
        const data = await getExpenseLocationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Expense Location retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createExpenseLocation = async (req, res) => {
    try {
        const data = await createExpenseLocation(req.body);
        res.status(201);
        sendResponse(res, true, 'Expense Location created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateExpenseLocation = async (req, res) => {
    try {
        const item = await getExpenseLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateExpenseLocation(item, req.body);
        sendResponse(res, true, 'Expense Location updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteExpenseLocation = async (req, res) => {
    try {
        const item = await getExpenseLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteExpenseLocation(item);
        sendResponse(res, true, 'Expense Location deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
