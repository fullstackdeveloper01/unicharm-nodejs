
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Unit } = require('../../models/superAdmin');



const getAllUnits = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };
    if (search) whereClause.Title = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        order: [['Id', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Unit.findAndCountAll(queryOptions);
};
const getUnitById = async (id) => Unit.findByPk(id);
const createUnit = async (data) => Unit.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateUnit = async (item, data) => item.update(data);
const deleteUnit = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllUnits = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllUnits(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Units retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getUnitById = async (req, res) => {
    try {
        const data = await getUnitById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Unit retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createUnit = async (req, res) => {
    try {
        const data = await createUnit(req.body);
        res.status(201);
        sendResponse(res, true, 'Unit created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateUnit = async (req, res) => {
    try {
        const item = await getUnitById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateUnit(item, req.body);
        sendResponse(res, true, 'Unit updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteUnit = async (req, res) => {
    try {
        const item = await getUnitById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteUnit(item);
        sendResponse(res, true, 'Unit deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
