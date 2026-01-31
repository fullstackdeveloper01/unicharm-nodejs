

// --- Business Logic (Merged) ---

const { Category } = require('../../models/superAdmin');


const getAllCategories = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: { IsDeleted: false }
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const { count, rows } = await Category.findAndCountAll(queryOptions);
    const mappedRows = rows.map(cat => ({
        ...cat.toJSON(),
        CategoryDescription: cat.Description
    }));
    return { count, rows: mappedRows };
};
const getCategoryById = async (id) => Category.findByPk(id);
const createCategory = async (data) => Category.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateCategory = async (item, data) => item.update(data);
const deleteCategory = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllCategories(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Categories retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getCategoryById = async (req, res) => {
    try {
        const item = await getCategoryById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = { ...item.toJSON(), CategoryDescription: item.Description };
        sendResponse(res, true, 'Category retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCategory = async (req, res) => {
    try {
        const payload = { ...req.body, Description: req.body.CategoryDescription || req.body.Description };
        const data = await createCategory(payload);
        res.status(201);
        sendResponse(res, true, 'Category created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const item = await getCategoryById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const payload = { ...req.body, Description: req.body.CategoryDescription || req.body.Description };
        const data = await updateCategory(item, payload);
        sendResponse(res, true, 'Category updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        const item = await getCategoryById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteCategory(item);
        sendResponse(res, true, 'Category deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
