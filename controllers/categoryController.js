const service = require('../services/categoryService');
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await service.getAllCategories(page, limit);

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
        const item = await service.getCategoryById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = { ...item.toJSON(), CategoryDescription: item.Description };
        sendResponse(res, true, 'Category retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createCategory = async (req, res) => {
    try {
        const payload = { ...req.body, Description: req.body.CategoryDescription || req.body.Description };
        const data = await service.createCategory(payload);
        res.status(201);
        sendResponse(res, true, 'Category created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const item = await service.getCategoryById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const payload = { ...req.body, Description: req.body.CategoryDescription || req.body.Description };
        const data = await service.updateCategory(item, payload);
        sendResponse(res, true, 'Category updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        const item = await service.getCategoryById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await service.deleteCategory(item);
        sendResponse(res, true, 'Category deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
