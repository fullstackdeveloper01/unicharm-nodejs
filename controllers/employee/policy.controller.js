const policyService = require('../../services/employee/policy.service');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all policies
exports.getAllPolicies = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await policyService.getAllPolicies(page, limit, search);
        sendResponse(res, true, 'Policies retrieved successfully', result);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policies', null, { message: error.message });
    }
};

// Get policy by ID
exports.getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await policyService.getPolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        sendResponse(res, true, 'Policy retrieved successfully', policy);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policy', null, { message: error.message });
    }
};
