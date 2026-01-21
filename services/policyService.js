const db = require('../models');
const { Policy } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all policies
 * @returns {Promise<Array>} List of policies
 */
exports.getAllPolicies = async () => {
    return await Policy.findAll({
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
 * Get policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
exports.getPolicyById = async (id) => {
    return await Policy.findByPk(id);
};

/**
 * Create policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
exports.createPolicy = async (data) => {
    return await Policy.create({
        ...data,
        CreatedOn: new Date(),
        ModifiedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update policy
 * @param {Object} policy - Policy instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
exports.updatePolicy = async (policy, data) => {
    // Handle file replacement
    if (data.PdfPath && policy.PdfPath && data.PdfPath !== policy.PdfPath) {
        if (fs.existsSync(policy.PdfPath.replace('/', ''))) {
            try {
                fs.unlinkSync(policy.PdfPath.replace('/', ''));
            } catch (e) { console.error('Error deleting old policy pdf', e); }
        }
    }
    return await policy.update({
        ...data,
        ModifiedOn: new Date()
    });
};

/**
 * Delete policy (soft delete)
 * @param {Object} policy - Policy instance
 * @returns {Promise<Object>} Deleted policy
 */
exports.deletePolicy = async (policy) => {
    return await policy.update({ IsDeleted: true });
};
