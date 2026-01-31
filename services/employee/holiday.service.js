const db = require('../../models');
const { Holiday } = db;
const { Op } = require('sequelize');

/**
 * Get all holidays
 * @returns {Promise<Array>} List of holidays
 */
exports.getHolidays = async () => {
    const holidays = await Holiday.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['HolidayDate', 'ASC']],
        attributes: ['Id', 'Name', 'HolidayDate']
    });

    return holidays.map(holiday => ({
        id: holiday.Id,
        title: holiday.Name,
        date: holiday.HolidayDate
    }));
};
