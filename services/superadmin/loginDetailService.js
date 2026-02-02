const db = require('../../models');
const { LoginDetail } = db;
const { Op } = require('sequelize');

/**
 * Get all login details
 * @returns {Promise<Array>} List of login details
 */
exports.getAllLoginDetails = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        order: [['LoginDatetime', 'DESC']]
    };

    if (search) {
        queryOptions.where = { Email: { [Op.like]: `%${search}%` } };
    }

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await LoginDetail.findAndCountAll(queryOptions);
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
