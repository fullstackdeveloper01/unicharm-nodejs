const db = require('../../models');
const { SalesPricePolicy } = db;

/**
 * Get all sales price policies
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search term
 * @returns {Promise<Object>} List of sales price policies
 */
exports.getAllSalesPricePolicies = async (page = 1, limit = null, search = '') => {
    return await SalesPricePolicy.getAllPolicies(page, limit, search);
};

/**
 * Get sales price policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
exports.getSalesPricePolicyById = async (id) => {
    return await SalesPricePolicy.getPolicyById(id);
};

/**
 * Create sales price policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
exports.createSalesPricePolicy = async (data) => {
    return await SalesPricePolicy.createPolicy(data);
};

/**
 * Update sales price policy
 * @param {number} id - Policy ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
exports.updateSalesPricePolicy = async (id, data) => {
    return await SalesPricePolicy.updatePolicy(id, data);
};

/**
 * Delete sales price policy (soft delete)
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Deleted policy
 */
exports.deleteSalesPricePolicy = async (id) => {
    return await SalesPricePolicy.deletePolicy(id);
};
