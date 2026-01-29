const salesPricePolicyService = require('../services/salesPricePolicyService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all policies
exports.getAllSalesPricePolicies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await salesPricePolicyService.getAllSalesPricePolicies(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Policies retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policies', null, { message: error.message });
    }
};

// Get policy by ID
exports.getSalesPricePolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await salesPricePolicyService.getSalesPricePolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        sendResponse(res, true, 'Policy retrieved successfully', policy);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policy', null, { message: error.message });
    }
};

// Create policy
exports.createSalesPricePolicy = async (req, res) => {
    try {
        const policyData = req.body;
        const policy = await salesPricePolicyService.createSalesPricePolicy(policyData);
        res.status(201);
        sendResponse(res, true, 'Policy created successfully', policy);
    } catch (error) {
        sendResponse(res, false, 'Failed to create policy', null, { message: error.message });
    }
};

// Update policy
exports.updateSalesPricePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await salesPricePolicyService.getSalesPricePolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        const updatedPolicy = await salesPricePolicyService.updateSalesPricePolicy(policy, req.body);
        sendResponse(res, true, 'Policy updated successfully', updatedPolicy);
    } catch (error) {
        sendResponse(res, false, 'Failed to update policy', null, { message: error.message });
    }
};

// Delete policy
exports.deleteSalesPricePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await salesPricePolicyService.getSalesPricePolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        await salesPricePolicyService.deleteSalesPricePolicy(policy);
        sendResponse(res, true, 'Policy deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete policy', null, { message: error.message });
    }
};
