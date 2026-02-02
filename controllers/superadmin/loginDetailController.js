const loginDetailService = require('../../services/superadmin/loginDetailService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = {
        success,
        message,
        data,
        errors
    };

    if (pagination) {
        response.pagination = pagination;
    }

    res.json(response);
};

// Get all login details
exports.getAllLoginDetails = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await loginDetailService.getAllLoginDetails(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Login details retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve login details', null, { message: error.message });
    }
};

// Get login detail by ID
exports.getLoginDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        const detail = await loginDetailService.getLoginDetailById(id);

        if (!detail) {
            return sendResponse(res, false, 'Login detail not found');
        }

        sendResponse(res, true, 'Login detail retrieved successfully', detail);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve login detail', null, { message: error.message });
    }
};
