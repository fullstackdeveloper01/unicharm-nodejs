const db = require('../models');
const { CorporatePricePolicy } = db;

/**
 * Get all corporate price policies
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search term
 * @returns {Promise<Object>} List of corporate price policies
 */
exports.getAllCorporatePricePolicies = async (page = 1, limit = null, search = '') => {
    return await CorporatePricePolicy.getAllPolicies(page, limit, search);
};

/**
 * Get corporate price policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
exports.getCorporatePricePolicyById = async (id) => {
    return await CorporatePricePolicy.getPolicyById(id);
};

/**
 * Create corporate price policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
exports.createCorporatePricePolicy = async (data) => {
    return await CorporatePricePolicy.createPolicy(data);
};

/**
 * Update corporate price policy
 * @param {number} id - Policy ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
exports.updateCorporatePricePolicy = async (id, data) => {
    return await CorporatePricePolicy.updatePolicy(id, data);
};

/**
 * Delete corporate price policy (soft delete)
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Deleted policy
 */
exports.deleteCorporatePricePolicy = async (id) => {
    return await CorporatePricePolicy.deletePolicy(id);
};
