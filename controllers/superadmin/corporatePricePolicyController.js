const corporatePricePolicyService = require('../../services/superadmin/corporatePricePolicyService');
const { validationResult } = require('express-validator');
const multer = require('multer');

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
 * Get all corporate price policies
 * GET /api/corporate-price-policies
 */
exports.getAllCorporatePricePolicies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await corporatePricePolicyService.getAllCorporatePricePolicies(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false,
            hasPrev: page > 1
        };

        sendResponse(res, 200, true, 'Corporate price policies retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        console.error('Error in getAllCorporatePricePolicies:', error);
        sendResponse(res, 500, false, 'Failed to retrieve corporate price policies', null, { message: error.message });
    }
};

/**
 * Get corporate price policy by ID
 * GET /api/corporate-price-policies/:id
 */
exports.getCorporatePricePolicyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return sendResponse(res, 400, false, 'Invalid policy ID', null, { message: 'Policy ID must be a valid number' });
        }

        const policy = await corporatePricePolicyService.getCorporatePricePolicyById(id);

        if (!policy) {
            return sendResponse(res, 404, false, 'Corporate price policy not found');
        }

        sendResponse(res, 200, true, 'Corporate price policy retrieved successfully', policy);
    } catch (error) {
        console.error('Error in getCorporatePricePolicyById:', error);
        sendResponse(res, 500, false, 'Failed to retrieve corporate price policy', null, { message: error.message });
    }
};

/**
 * Create new corporate price policy
 * POST /api/corporate-price-policies
 */
exports.createCorporatePricePolicy = async (req, res) => {
    const uploadMiddleware = upload.any();

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return sendResponse(res, 400, false, 'Form data parsing failed', null, { message: err.message });
        }

        try {
            // Flexible field extraction (Model uses snake_case)
            const policyData = {
                designation: req.body.designation || req.body.Designation,
                mobile: req.body.mobile || req.body.Mobile,
                entertainment: req.body.entertainment || req.body.Entertainment,
                vehicle: req.body.vehicle || req.body.Vehicle,
                lodging_metro: req.body.lodging_metro || req.body.LodgingMetro || req.body.lodgingMetro,
                lodging_non_metro: req.body.lodging_non_metro || req.body.LodgingNonMetro || req.body.lodgingNonMetro,
                travel_mode: req.body.travel_mode || req.body.TravelMode || req.body.travelMode,
                travel_own: req.body.travel_own || req.body.TravelOwn || req.body.travelOwn,
                other: req.body.other || req.body.Other,
                business_promo: req.body.business_promo || req.body.BusinessPromo || req.body.businessPromo,
                rnd: req.body.rnd || req.body.RND || req.body.RnD || req.body.RED, // Handling RED typo if implies RND
                csr: req.body.csr || req.body.CSR,
                actions: req.body.actions || req.body.Actions || req.body.Status || req.body.status || 'Active' // Map Status to actions
            };

            // Basic validation
            if (!policyData.designation) {
                return sendResponse(res, 400, false, 'Validation failed', null, { message: 'Designation is required' });
            }

            const policy = await corporatePricePolicyService.createCorporatePricePolicy(policyData);
            sendResponse(res, 201, true, 'Corporate price policy created successfully', policy);
        } catch (error) {
            console.error('Error in createCorporatePricePolicy:', error);
            sendResponse(res, 500, false, 'Failed to create corporate price policy', null, { message: error.message });
        }
    });
};

/**
 * Update corporate price policy
 * PUT /api/corporate-price-policies/:id
 */
exports.updateCorporatePricePolicy = async (req, res) => {
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
            // Map frontend keys to DB snake_case keys
            const fields = [
                { key: 'designation', variants: ['designation', 'Designation'] },
                { key: 'mobile', variants: ['mobile', 'Mobile'] },
                { key: 'entertainment', variants: ['entertainment', 'Entertainment'] },
                { key: 'vehicle', variants: ['vehicle', 'Vehicle'] },
                { key: 'lodging_metro', variants: ['lodging_metro', 'LodgingMetro', 'lodgingMetro'] },
                { key: 'lodging_non_metro', variants: ['lodging_non_metro', 'LodgingNonMetro', 'lodgingNonMetro'] },
                { key: 'travel_mode', variants: ['travel_mode', 'TravelMode', 'travelMode'] },
                { key: 'travel_own', variants: ['travel_own', 'TravelOwn', 'travelOwn'] },
                { key: 'other', variants: ['other', 'Other'] },
                { key: 'business_promo', variants: ['business_promo', 'BusinessPromo', 'businessPromo'] },
                { key: 'rnd', variants: ['rnd', 'RND', 'RnD', 'RED'] },
                { key: 'csr', variants: ['csr', 'CSR'] },
                { key: 'actions', variants: ['actions', 'Actions', 'Status', 'status'] }
            ];

            fields.forEach(field => {
                for (const variant of field.variants) {
                    if (req.body[variant] !== undefined) {
                        updateData[field.key] = req.body[variant];
                        break;
                    }
                }
            });

            const updatedPolicy = await corporatePricePolicyService.updateCorporatePricePolicy(id, updateData);
            sendResponse(res, 200, true, 'Corporate price policy updated successfully', updatedPolicy);
        } catch (error) {
            console.error('Error in updateCorporatePricePolicy:', error);
            if (error.message === 'Policy not found') {
                return sendResponse(res, 404, false, 'Corporate price policy not found');
            }
            sendResponse(res, 500, false, 'Failed to update corporate price policy', null, { message: error.message });
        }
    });
};

/**
 * Delete corporate price policy (soft delete)
 * DELETE /api/corporate-price-policies/:id
 */
exports.deleteCorporatePricePolicy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return sendResponse(res, 400, false, 'Invalid policy ID', null, { message: 'Policy ID must be a valid number' });
        }

        await corporatePricePolicyService.deleteCorporatePricePolicy(id);
        sendResponse(res, 200, true, 'Corporate price policy deleted successfully');
    } catch (error) {
        console.error('Error in deleteCorporatePricePolicy:', error);
        if (error.message === 'Policy not found') {
            return sendResponse(res, 404, false, 'Corporate price policy not found');
        }
        sendResponse(res, 500, false, 'Failed to delete corporate price policy', null, { message: error.message });
    }
};
