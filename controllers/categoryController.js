const service = require('../services/categoryService');
const sendResponse = (res, success, message, data = null, errors = null) => res.json({ success, message, data, errors });

exports.getAllCategories = async (req, res) => {
    try {
        const data = await service.getAllCategories();
        sendResponse(res, true, 'Categories retrieved', data);
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
