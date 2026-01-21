const loginDetailService = require('../services/loginDetailService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all login details
exports.getAllLoginDetails = async (req, res) => {
    try {
        const details = await loginDetailService.getAllLoginDetails();
        sendResponse(res, true, 'Login details retrieved successfully', details);
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
