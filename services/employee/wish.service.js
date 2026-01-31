const db = require('../../models');
const { TodaysBirthdateAndAnniversary, Employee } = db;
const { Op } = require('sequelize');

/**
 * Send a wish (birthday or anniversary)
 * @param {Object} data 
 * @returns {Promise<Object>} Created wish
 */
exports.sendWish = async (data) => {
    return await TodaysBirthdateAndAnniversary.create({
        ...data,
        CreatedOn: new Date()
    });
};

/**
 * Get wishes for a user
 * @param {number} userId 
 * @param {string} type - Optional filter by type
 * @returns {Promise<Array>} List of wishes
 */
exports.getWishes = async (userId, type = null) => {
    const where = { BirthdateUsertId: userId };
    if (type) {
        where.Type = type;
    }

    return await TodaysBirthdateAndAnniversary.findAll({
        where: where,
        include: [
            { model: Employee, as: 'sender', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] }
        ],
        order: [['CreatedOn', 'DESC']]
    });
};
