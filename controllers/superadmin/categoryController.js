const categoryService = require('../../services/superadmin/categoryService');

// Helper for response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await categoryService.getAllCategories(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Categories retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve categories', null, { message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);

        if (!category) {
            return sendResponse(res, false, 'Category not found');
        }

        sendResponse(res, true, 'Category retrieved successfully', category);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve category', null, { message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { CategoryName, Description } = req.body;

        const category = await categoryService.createCategory({
            CategoryName,
            Description
        });

        res.status(201);
        sendResponse(res, true, 'Category created successfully', category);
    } catch (error) {
        sendResponse(res, false, 'Failed to create category', null, { message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);

        if (!category) {
            return sendResponse(res, false, 'Category not found');
        }

        const { CategoryName, Description } = req.body;
        const updateData = {};
        if (CategoryName !== undefined) updateData.CategoryName = CategoryName;
        if (Description !== undefined) updateData.Description = Description;

        const updatedCategory = await categoryService.updateCategory(category, updateData);
        sendResponse(res, true, 'Category updated successfully', updatedCategory);
    } catch (error) {
        sendResponse(res, false, 'Failed to update category', null, { message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);

        if (!category) {
            return sendResponse(res, false, 'Category not found');
        }

        await categoryService.deleteCategory(category);
        sendResponse(res, true, 'Category deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete category', null, { message: error.message });
    }
};
