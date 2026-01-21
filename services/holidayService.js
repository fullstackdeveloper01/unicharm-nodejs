const db = require('../models');
const { Holiday } = db;
const { Op } = require('sequelize');

/**
 * Get all holidays
 * @returns {Promise<Array>} List of holidays
 */
exports.getAllHolidays = async () => {
    return await Holiday.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['HolidayDate', 'ASC']]
    });
};

/**
 * Get holiday by ID
 * @param {number} id - Holiday ID
 * @returns {Promise<Object>} Holiday
 */
exports.getHolidayById = async (id) => {
    return await Holiday.findByPk(id);
};

/**
 * Create holiday
 * @param {Object} data - Holiday data
 * @returns {Promise<Object>} Created holiday
 */
exports.createHoliday = async (data) => {
    return await Holiday.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update holiday
 * @param {Object} holiday - Holiday instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated holiday
 */
exports.updateHoliday = async (holiday, data) => {
    return await holiday.update(data);
};

/**
 * Delete holiday (soft delete)
 * @param {Object} holiday - Holiday instance
 * @returns {Promise<Object>} Deleted holiday
 */
exports.deleteHoliday = async (holiday) => {
    return await holiday.update({ IsDeleted: true });
};
