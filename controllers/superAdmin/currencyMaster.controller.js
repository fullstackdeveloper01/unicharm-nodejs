

// --- Business Logic (Merged) ---

const { CurrencyMaster, Sequelize } = require('../../models/superAdmin');

const { Op } = Sequelize;

const getAllCurrencies = async (page = 1, limit = null, search = '') => {
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

    return CurrencyMaster.findAndCountAll(queryOptions);
};
const getCurrencyById = async (id) => CurrencyMaster.findByPk(id);
const createCurrency = async (data) => CurrencyMaster.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateCurrency = async (item, data) => item.update(data);
const deleteCurrency = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCurrencies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllCurrencies(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Currencies retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getCurrencyById = async (req, res) => {
    try {
        const data = await getCurrencyById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Currency retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCurrency = async (req, res) => {
    try {
        const data = await createCurrency(req.body);
        res.status(201);
        sendResponse(res, true, 'Currency created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCurrency = async (req, res) => {
    try {
        const item = await getCurrencyById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateCurrency(item, req.body);
        sendResponse(res, true, 'Currency updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCurrency = async (req, res) => {
    try {
        const item = await getCurrencyById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteCurrency(item);
        sendResponse(res, true, 'Currency deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
