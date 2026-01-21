const db = require('../models');
const { SalesPricePolicy } = db;
const { Op } = require('sequelize');

/**
 * Get all sales price policies
 * @returns {Promise<Array>} List of sales price policies
 */
exports.getAllSalesPricePolicies = async () => {
    return await SalesPricePolicy.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });
};

/**
 * Get sales price policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
exports.getSalesPricePolicyById = async (id) => {
    return await SalesPricePolicy.findByPk(id);
};

/**
 * Create sales price policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
exports.createSalesPricePolicy = async (data) => {
    return await SalesPricePolicy.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update sales price policy
 * @param {Object} policy - Policy instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
exports.updateSalesPricePolicy = async (policy, data) => {
    return await policy.update(data);
};

/**
 * Delete sales price policy (soft delete)
 * @param {Object} policy - Policy instance
 * @returns {Promise<Object>} Deleted policy
 */
exports.deleteSalesPricePolicy = async (policy) => {
    return await policy.update({ IsDeleted: true });
};
