
const { validationResult } = require('express-validator');
const multer = require('multer');


// --- Business Logic (Merged) ---

const { SalesPricePolicy } = require('../../models/superAdmin');


/**
 * Get all sales price policies
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search term
 * @returns {Promise<Object>} List of sales price policies
 */
const getAllSalesPricePolicies = async (page = 1, limit = null, search = '') => {
    return await SalesPricePolicy.getAllPolicies(page, limit, search);
};

/**
 * Get sales price policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
const getSalesPricePolicyById = async (id) => {
    return await SalesPricePolicy.getPolicyById(id);
};

/**
 * Create sales price policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
const createSalesPricePolicy = async (data) => {
    return await SalesPricePolicy.createPolicy(data);
};

/**
 * Update sales price policy
 * @param {number} id - Policy ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
const updateSalesPricePolicy = async (id, data) => {
    return await SalesPricePolicy.updatePolicy(id, data);
};

/**
 * Delete sales price policy (soft delete)
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Deleted policy
 */
const deleteSalesPricePolicy = async (id) => {
    return await SalesPricePolicy.deletePolicy(id);
};

// -----------------------------

// Configure multer (no file storage needed, just parsing)
const upload = multer();

// Helper for standard response
const sendResponse = (res, statusCode, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message };
    if (data !== null) response.data = data;
    if (errors !== null) response.errors = errors;
    if (pagination) response.pagination = pagination;
    res.status(statusCode).json(response);
};

// ... (Getters remain same)

/**
 * Get all sales price policies
 * GET /api/sales-price-policies
 */
exports.getAllSalesPricePolicies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllSalesPricePolicies(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false,
            hasPrev: page > 1
        };

        sendResponse(res, 200, true, 'Sales price policies retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        console.error('Error in getAllSalesPricePolicies:', error);
        sendResponse(res, 500, false, 'Failed to retrieve sales price policies', null, { message: error.message });
    }
};

/**
 * Get sales price policy by ID
 * GET /api/sales-price-policies/:id
 */
exports.getSalesPricePolicyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return sendResponse(res, 400, false, 'Invalid policy ID', null, { message: 'Policy ID must be a valid number' });
        }

        const policy = await getSalesPricePolicyById(id);

        if (!policy) {
            return sendResponse(res, 404, false, 'Sales price policy not found');
        }

        sendResponse(res, 200, true, 'Sales price policy retrieved successfully', policy);
    } catch (error) {
        console.error('Error in getSalesPricePolicyById:', error);
        sendResponse(res, 500, false, 'Failed to retrieve sales price policy', null, { message: error.message });
    }
};

// ... (Top remains same)

/**
 * Create new sales price policy
 * POST /api/sales-price-policies
 */
exports.createSalesPricePolicy = async (req, res) => {
    const uploadMiddleware = upload.any();

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return sendResponse(res, 400, false, 'Form data parsing failed', null, { message: err.message });
        }

        try {
            // Flexible field extraction
            const policyData = {
                DesignationRank: req.body.DesignationRank || req.body.designationRank || req.body.designation_rank || req.body.designation || req.body.Designation,
                CompetencyRank: req.body.CompetencyRank || req.body.competencyRank || req.body.competency_rank || req.body.competency || req.body.Competency,
                HqDaMetro: req.body.HqDaMetro || req.body.hqDaMetro || req.body.hq_da_metro,
                HqDaNonMetro: req.body.HqDaNonMetro || req.body.hqDaNonMetro || req.body.hq_da_non_metro,
                ExHqDaMetro: req.body.ExHqDaMetro || req.body.exHqDaMetro || req.body.ex_hq_da_metro,
                ExHqDaNonMetro: req.body.ExHqDaNonMetro || req.body.exHqDaNonMetro || req.body.ex_hq_da_non_metro,
                UpcountryMetro: req.body.UpcountryMetro || req.body.upcountryMetro || req.body.upcountry_metro,
                UpcountryNonMetro: req.body.UpcountryNonMetro || req.body.upcountryNonMetro || req.body.upcountry_non_metro,
                LodgingAndBoarding: req.body.LodgingAndBoarding || req.body.lodgingAndBoarding || req.body.lodging_and_boarding || req.body.lodging || req.body.Lodging,
                Status: req.body.Status || req.body.status || 'Active'
            };

            // Basic validation
            if (!policyData.DesignationRank) {
                return sendResponse(res, 400, false, 'Validation failed', null, { message: 'DesignationRank is required' });
            }

            const policy = await createSalesPricePolicy(policyData);
            sendResponse(res, 201, true, 'Sales price policy created successfully', policy);
        } catch (error) {
            console.error('Error in createSalesPricePolicy:', error);
            sendResponse(res, 500, false, 'Failed to create sales price policy', null, { message: error.message });
        }
    });
};

/**
 * Update sales price policy
 * PUT /api/sales-price-policies/:id
 */
exports.updateSalesPricePolicy = async (req, res) => {
    const uploadMiddleware = upload.any();

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return sendResponse(res, 400, false, 'Form data parsing failed', null, { message: err.message });
        }

        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return sendResponse(res, 400, false, 'Invalid policy ID', null, { message: 'Policy ID must be a valid number' });
            }

            // Flexible field extraction for updates
            const updateData = {};
            const fields = [
                { key: 'DesignationRank', variants: ['DesignationRank', 'designationRank', 'designation_rank', 'designation', 'Designation'] },
                { key: 'CompetencyRank', variants: ['CompetencyRank', 'competencyRank', 'competency_rank', 'competency', 'Competency'] },
                { key: 'HqDaMetro', variants: ['HqDaMetro', 'hqDaMetro', 'hq_da_metro'] },
                { key: 'HqDaNonMetro', variants: ['HqDaNonMetro', 'hqDaNonMetro', 'hq_da_non_metro'] },
                { key: 'ExHqDaMetro', variants: ['ExHqDaMetro', 'exHqDaMetro', 'ex_hq_da_metro'] },
                { key: 'ExHqDaNonMetro', variants: ['ExHqDaNonMetro', 'exHqDaNonMetro', 'ex_hq_da_non_metro'] },
                { key: 'UpcountryMetro', variants: ['UpcountryMetro', 'upcountryMetro', 'upcountry_metro'] },
                { key: 'UpcountryNonMetro', variants: ['UpcountryNonMetro', 'upcountryNonMetro', 'upcountry_non_metro'] },
                { key: 'LodgingAndBoarding', variants: ['LodgingAndBoarding', 'lodgingAndBoarding', 'lodging_and_boarding', 'lodging', 'Lodging'] },
                { key: 'Status', variants: ['Status', 'status'] }
            ];

            fields.forEach(field => {
                for (const variant of field.variants) {
                    if (req.body[variant] !== undefined) {
                        updateData[field.key] = req.body[variant];
                        break;
                    }
                }
            });

            const updatedPolicy = await updateSalesPricePolicy(id, updateData);
            sendResponse(res, 200, true, 'Sales price policy updated successfully', updatedPolicy);
        } catch (error) {
            console.error('Error in updateSalesPricePolicy:', error);
            if (error.message === 'Policy not found') {
                return sendResponse(res, 404, false, 'Sales price policy not found');
            }
            sendResponse(res, 500, false, 'Failed to update sales price policy', null, { message: error.message });
        }
    });
};

/**
 * Delete sales price policy (soft delete)
 * DELETE /api/sales-price-policies/:id
 */
exports.deleteSalesPricePolicy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return sendResponse(res, 400, false, 'Invalid policy ID', null, { message: 'Policy ID must be a valid number' });
        }

        await deleteSalesPricePolicy(id);
        sendResponse(res, 200, true, 'Sales price policy deleted successfully');
    } catch (error) {
        console.error('Error in deleteSalesPricePolicy:', error);
        if (error.message === 'Policy not found') {
            return sendResponse(res, 404, false, 'Sales price policy not found');
        }
        sendResponse(res, 500, false, 'Failed to delete sales price policy', null, { message: error.message });
    }
};
