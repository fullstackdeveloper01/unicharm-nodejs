
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Room, Floor } = require('../../models/superAdmin');




const getAllRooms = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) whereClause.RoomName = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        include: [{ model: Floor, as: 'floor' }]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Room.findAndCountAll(queryOptions);
};

const getRoomById = async (id) => {
    return await Room.findByPk(id, {
        include: [{ model: Floor, as: 'floor' }]
    });
};

const createRoom = async (data) => {
    return await Room.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

const updateRoom = async (room, data) => {
    return await room.update(data);
};

const deleteRoom = async (room) => {
    return await room.update({ IsDeleted: true });
};

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllRooms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllRooms(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Rooms retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getRoomById = async (req, res) => {
    try {
        const data = await getRoomById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Room retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createRoom = async (req, res) => {
    try {
        const data = await createRoom(req.body);
        res.status(201);
        sendResponse(res, true, 'Room created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateRoom = async (req, res) => {
    try {
        const item = await getRoomById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateRoom(item, req.body);
        sendResponse(res, true, 'Room updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteRoom = async (req, res) => {
    try {
        const item = await getRoomById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteRoom(item);
        sendResponse(res, true, 'Room deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
