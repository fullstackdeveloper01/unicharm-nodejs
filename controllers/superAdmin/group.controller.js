
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Group } = require('../../models/superAdmin');




const getAllGroups = async (page = 1, limit = null) => {
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

    const { count, rows } = await Group.findAndCountAll(queryOptions);

    const mappedRows = rows.map(g => {
        const plain = g.get({ plain: true });
        try { plain.Members = JSON.parse(plain.Members || '[]'); } catch (e) { plain.Members = []; }
        return plain;
    });

    return { count, rows: mappedRows };
};

const getGroupById = async (id) => {
    return await Group.findByPk(id);
};

const createGroup = async (data) => {
    const groupData = { ...data, Members: JSON.stringify(data.Members || []), CreatedOn: new Date(), IsDeleted: false };
    return await Group.create(groupData);
};

const updateGroup = async (item, data) => {
    const updateData = { ...data };
    if (updateData.Members) updateData.Members = JSON.stringify(updateData.Members);
    return await item.update(updateData);
};

const deleteGroup = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllGroups = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllGroups(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Groups retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getGroupById = async (req, res) => {
    try {
        const item = await getGroupById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');

        const data = item.get({ plain: true });
        try { data.Members = JSON.parse(data.Members || '[]'); } catch (e) { data.Members = []; }

        sendResponse(res, true, 'Group retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createGroup = async (req, res) => {
    try {
        const data = await createGroup(req.body);
        res.status(201);
        sendResponse(res, true, 'Group created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateGroup = async (req, res) => {
    try {
        const item = await getGroupById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateGroup(item, req.body);
        sendResponse(res, true, 'Group updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteGroup = async (req, res) => {
    try {
        const item = await getGroupById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteGroup(item);
        sendResponse(res, true, 'Group deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
