
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Floor, Location } = require('../../models/superAdmin');




const getAllFloors = async (page = 1, limit = null) => {
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
        },
        include: [{ model: Location, as: 'location' }]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Floor.findAndCountAll(queryOptions);
};

const getFloorById = async (id) => {
    return await Floor.findByPk(id, {
        include: [{ model: Location, as: 'location' }]
    });
};

const createFloor = async (data) => {
    return await Floor.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

const updateFloor = async (floor, data) => {
    return await floor.update(data);
};

const deleteFloor = async (floor) => {
    return await floor.update({ IsDeleted: true });
};

const getFloorsDropdown = async () => {
    const floors = await Floor.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        attributes: ['Id', 'FloorName', 'LocationId']
    });

    return floors.map(floor => ({
        value: floor.Id,
        label: floor.FloorName,
        locationId: floor.LocationId,
        LocationId: floor.LocationId,
        Location: floor.LocationId
    }));
};

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllFloors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllFloors(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Floors retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getFloorById = async (req, res) => {
    try {
        const data = await getFloorById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Floor retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createFloor = async (req, res) => {
    try {
        const data = await createFloor(req.body);
        res.status(201);
        sendResponse(res, true, 'Floor created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateFloor = async (req, res) => {
    try {
        const item = await getFloorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateFloor(item, req.body);
        sendResponse(res, true, 'Floor updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteFloor = async (req, res) => {
    try {
        const item = await getFloorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteFloor(item);
        sendResponse(res, true, 'Floor deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getFloorsDropdown = async (req, res) => {
    try {
        const data = await getFloorsDropdown();
        sendResponse(res, true, 'Floors retrieved for dropdown', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
