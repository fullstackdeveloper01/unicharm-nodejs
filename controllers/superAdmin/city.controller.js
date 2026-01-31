
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { City } = require('../../models/superAdmin');




const getAllCities = async (page = 1, limit = null) => {
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

    return City.findAndCountAll(queryOptions);
};
const getCityById = async (id) => City.findByPk(id);
const createCity = async (data) => City.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateCity = async (item, data) => item.update(data);
const deleteCity = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllCities(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Cities retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getCityById = async (req, res) => {
    try {
        const data = await getCityById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'City retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCity = async (req, res) => {
    try {
        const data = await createCity(req.body);
        res.status(201);
        sendResponse(res, true, 'City created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCity = async (req, res) => {
    try {
        const item = await getCityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateCity(item, req.body);
        sendResponse(res, true, 'City updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCity = async (req, res) => {
    try {
        const item = await getCityById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteCity(item);
        sendResponse(res, true, 'City deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
