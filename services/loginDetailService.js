const db = require('../models');
const { LoginDetail } = db;

/**
 * Get all login details
 * @returns {Promise<Array>} List of login details
 */
exports.getAllLoginDetails = async () => {
    return await LoginDetail.findAll({
        order: [['LoginDatetime', 'DESC']]
    });
};

/**
 * Get login detail by ID
 * @param {number} id - Login detail ID
 * @returns {Promise<Object>} Login detail
 */
exports.getLoginDetailById = async (id) => {
    return await LoginDetail.findByPk(id);
};

// Start Date and End Date sorting or filtering could be added here if requested,
// but sticking to basic GetAll for now.
