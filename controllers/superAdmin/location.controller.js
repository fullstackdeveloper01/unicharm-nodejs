
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Location } = require('../../models/superAdmin');




const getAllLocations = async (page = 1, limit = null, zoneId = null) => {
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
    if (zoneId) whereClause.ZoneId = zoneId;

    const queryOptions = {
        where: whereClause
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Location.findAndCountAll(queryOptions);
};

const getLocationById = async (id) => {
    return await Location.findByPk(id);
};

const createLocation = async (data) => {
    return await Location.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

const updateLocation = async (location, data) => {
    return await location.update(data);
};

const deleteLocation = async (location) => {
    return await location.update({ IsDeleted: true });
};

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllLocations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const zoneId = req.query.zoneId ? parseInt(req.query.zoneId) : null;

        const result = await getAllLocations(page, limit, zoneId);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Locations retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getLocationById = async (req, res) => {
    try {
        const data = await getLocationById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Location retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createLocation = async (req, res) => {
    try {
        const data = await createLocation(req.body);
        res.status(201);
        sendResponse(res, true, 'Location created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateLocation = async (req, res) => {
    try {
        const item = await getLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateLocation(item, req.body);
        sendResponse(res, true, 'Location updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteLocation = async (req, res) => {
    try {
        const item = await getLocationById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteLocation(item);
        sendResponse(res, true, 'Location deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
