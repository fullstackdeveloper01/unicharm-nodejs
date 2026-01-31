
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { PriorityMaster } = require('../../models/superAdmin');




const getAllPriorities = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        }
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return PriorityMaster.findAndCountAll(queryOptions);
};
const getPriorityById = async (id) => PriorityMaster.findByPk(id);
const createPriority = async (data) => PriorityMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updatePriority = async (item, data) => item.update(data);
const deletePriority = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllPriorities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllPriorities(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Priorities retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getPriorityById = async (req, res) => {
    try {
        const data = await getPriorityById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Priority retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createPriority = async (req, res) => {
    try {
        const data = await createPriority(req.body);
        res.status(201);
        sendResponse(res, true, 'Priority created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updatePriority = async (req, res) => {
    try {
        const item = await getPriorityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updatePriority(item, req.body);
        sendResponse(res, true, 'Priority updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deletePriority = async (req, res) => {
    try {
        const item = await getPriorityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deletePriority(item);
        sendResponse(res, true, 'Priority deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
