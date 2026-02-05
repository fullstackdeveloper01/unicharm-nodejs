const salesPricePolicyService = require('../../services/superadmin/salesPricePolicyService');
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
 * Get all sales price policies
 * GET /api/sales-price-policies
 */
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

        const policy = await salesPricePolicyService.getSalesPricePolicyById(id);

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
                DesignationRank: req.body.DesignationRank || req.body.designationRank,
                CompetencyRank: req.body.CompetencyRank || req.body.competencyRank,

                HqDaMetro: req.body.HqDaMetro || req.body.hqDaMetro,
                HqDaNonMetro: req.body.HqDaNonMetro || req.body.hqDaNonMetro,
                ExHqDaMetro: req.body.ExHqDaMetro || req.body.exHqDaMetro,
                ExHqDaNonMetro: req.body.ExHqDaNonMetro || req.body.exHqDaNonMetro,
                // New Mappings
                ExHqDaTtMt: req.body.ExHqDaTtMt || req.body.exHqDaTtMt || req.body.ex_hq_da_tt_mt,
                ExHqDaInstitution: req.body.ExHqDaInstitution || req.body.exHqDaInstitution || req.body.ex_hq_da_institution,

                UpcountryMetro: req.body.UpcountryMetro || req.body.upcountryMetro,
                UpcountryNonMetro: req.body.UpcountryNonMetro || req.body.upcountryNonMetro,

                // New Fields
                FoodHqDa: req.body.FoodHqDa || req.body.foodHqDa,
                FoodMetroOutstation: req.body.FoodMetroOutstation || req.body.foodMetroOutstation,
                PhoneCalls: req.body.PhoneCalls || req.body.phoneCalls,
                PhoneInternet: req.body.PhoneInternet || req.body.phoneInternet,
                Courier: req.body.Courier || req.body.courier,
                Stationary: req.body.Stationary || req.body.stationary,

                LodgingMetro: req.body.LodgingMetro || req.body.lodgingMetro,
                LodgingNonMetro: req.body.LodgingNonMetro || req.body.lodgingNonMetro,
                LodgingWithoutBill: req.body.LodgingWithoutBill || req.body.lodgingWithoutBill,
                LodgingAndBoarding: req.body.LodgingAndBoarding || req.body.lodgingAndBoarding, // Legacy support

                PetrolMetro: req.body.PetrolMetro || req.body.petrolMetro,
                PetrolNonMetro: req.body.PetrolNonMetro || req.body.petrolNonMetro,
                TollParking: req.body.TollParking || req.body.tollParking,

                MeetingDescription: req.body.MeetingDescription || req.body.meetingDescription,
                MeetingEligibility: req.body.MeetingEligibility || req.body.meetingEligibility,

                MaxDaysHqDa: req.body.MaxDaysHqDa || req.body.maxDaysHqDa,
                MaxDaysExHqDa: req.body.MaxDaysExHqDa || req.body.maxDaysExHqDa,
                MaxDaysOutstation: req.body.MaxDaysOutstation || req.body.maxDaysOutstation,

                Status: req.body.Status || req.body.status || 'Active'
            };

            // Basic validation
            if (!policyData.DesignationRank) {
                return sendResponse(res, 400, false, 'Validation failed', null, { message: 'DesignationRank is required' });
            }

            // Helper validator for money fields (Numbers, 'Actual', 'NIL', 'NA', empty allowed)
            const isValidMoneyField = (val) => {
                if (!val) return true;
                if (['actual', 'nil', 'na', 'on actual'].includes(val.toString().toLowerCase())) return true;
                // Allow "Rs. 500/-" or simple "500"
                const cleanVal = val.toString().replace(/[^0-9.]/g, '');
                return !isNaN(parseFloat(cleanVal)) && isFinite(cleanVal);
            };

            // Validate critical numeric-like fields
            const financialFields = [
                'HqDaMetro', 'HqDaNonMetro', 'FoodHqDa', 'LodgingMetro', 'LodgingNonMetro'
            ];

            for (const field of financialFields) {
                if (policyData[field] && !isValidMoneyField(policyData[field])) {
                    return sendResponse(res, 400, false, `Validation failed for ${field}`, null, { message: `${field} must be a number, 'Actual', 'NIL', or 'NA'` });
                }
            }

            const policy = await salesPricePolicyService.createSalesPricePolicy(policyData);
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
            const updateInput = {
                ...req.body,
                DesignationRank: req.body.DesignationRank || req.body.designationRank,
                CompetencyRank: req.body.CompetencyRank || req.body.competencyRank,
                HqDaMetro: req.body.HqDaMetro || req.body.hqDaMetro,
                HqDaNonMetro: req.body.HqDaNonMetro || req.body.hqDaNonMetro,
                ExHqDaMetro: req.body.ExHqDaMetro || req.body.exHqDaMetro,
                ExHqDaNonMetro: req.body.ExHqDaNonMetro || req.body.exHqDaNonMetro,
                // New Mappings
                ExHqDaTtMt: req.body.ExHqDaTtMt || req.body.exHqDaTtMt || req.body.ex_hq_da_tt_mt,
                ExHqDaInstitution: req.body.ExHqDaInstitution || req.body.exHqDaInstitution || req.body.ex_hq_da_institution,

                UpcountryMetro: req.body.UpcountryMetro || req.body.upcountryMetro,
                UpcountryNonMetro: req.body.UpcountryNonMetro || req.body.upcountryNonMetro,
                LodgingAndBoarding: req.body.LodgingAndBoarding || req.body.lodgingAndBoarding,
                Status: req.body.Status || req.body.status,

                // New Fields Mappings
                FoodHqDa: req.body.FoodHqDa || req.body.foodHqDa,
                FoodMetroOutstation: req.body.FoodMetroOutstation || req.body.foodMetroOutstation,
                PhoneCalls: req.body.PhoneCalls || req.body.phoneCalls,
                PhoneInternet: req.body.PhoneInternet || req.body.phoneInternet,
                Courier: req.body.Courier || req.body.courier,
                Stationary: req.body.Stationary || req.body.stationary,
                LodgingMetro: req.body.LodgingMetro || req.body.lodgingMetro,
                LodgingNonMetro: req.body.LodgingNonMetro || req.body.lodgingNonMetro,
                LodgingWithoutBill: req.body.LodgingWithoutBill || req.body.lodgingWithoutBill,
                PetrolMetro: req.body.PetrolMetro || req.body.petrolMetro,
                PetrolNonMetro: req.body.PetrolNonMetro || req.body.petrolNonMetro,
                TollParking: req.body.TollParking || req.body.tollParking,
                MeetingDescription: req.body.MeetingDescription || req.body.meetingDescription,
                MeetingEligibility: req.body.MeetingEligibility || req.body.meetingEligibility,
                MaxDaysHqDa: req.body.MaxDaysHqDa || req.body.maxDaysHqDa,
                MaxDaysExHqDa: req.body.MaxDaysExHqDa || req.body.maxDaysExHqDa,
                MaxDaysOutstation: req.body.MaxDaysOutstation || req.body.maxDaysOutstation
            };

            const updateData = {};
            const allowedFields = [
                'DesignationRank', 'CompetencyRank', 'HqDaMetro', 'HqDaNonMetro',
                'ExHqDaMetro', 'ExHqDaNonMetro', 'ExHqDaTtMt', 'ExHqDaInstitution',
                'UpcountryMetro', 'UpcountryNonMetro',
                'LodgingAndBoarding', 'Status',
                'FoodHqDa', 'FoodMetroOutstation', 'PhoneCalls', 'PhoneInternet',
                'Courier', 'Stationary', 'LodgingMetro', 'LodgingNonMetro', 'LodgingWithoutBill',
                'PetrolMetro', 'PetrolNonMetro', 'TollParking', 'MeetingDescription', 'MeetingEligibility',
                'MaxDaysHqDa', 'MaxDaysExHqDa', 'MaxDaysOutstation'
            ];

            allowedFields.forEach(key => {
                if (updateInput[key] !== undefined) {
                    updateData[key] = updateInput[key];
                }
            });

            // Helper validator (Same as create)
            const isValidMoneyField = (val) => {
                if (!val) return true;
                if (['actual', 'nil', 'na', 'on actual'].includes(val.toString().toLowerCase())) return true;
                const cleanVal = val.toString().replace(/[^0-9.]/g, '');
                return !isNaN(parseFloat(cleanVal)) && isFinite(cleanVal);
            };

            // Validate critical numericfields if they are being updated
            const financialFields = [
                'HqDaMetro', 'HqDaNonMetro', 'FoodHqDa', 'LodgingMetro', 'LodgingNonMetro'
            ];

            for (const field of financialFields) {
                if (updateData[field] && !isValidMoneyField(updateData[field])) {
                    return sendResponse(res, 400, false, `Validation failed for ${field}`, null, { message: `${field} must be a number, 'Actual', 'NIL', or 'NA'` });
                }
            }

            const updatedPolicy = await salesPricePolicyService.updateSalesPricePolicy(id, updateData);
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

        await salesPricePolicyService.deleteSalesPricePolicy(id);
        sendResponse(res, 200, true, 'Sales price policy deleted successfully');
    } catch (error) {
        console.error('Error in deleteSalesPricePolicy:', error);
        if (error.message === 'Policy not found') {
            return sendResponse(res, 404, false, 'Sales price policy not found');
        }
        sendResponse(res, 500, false, 'Failed to delete sales price policy', null, { message: error.message });
    }
};
