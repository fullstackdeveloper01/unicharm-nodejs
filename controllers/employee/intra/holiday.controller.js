
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Holiday } = require('../../../models/superAdmin');



/**
 * Get all holidays
 * @returns {Promise<Array>} List of holidays
 */
const getHolidays = async () => {
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

// -----------------------------


const sendResponse = (res, success, data = null, message = '') => {
    if (success) {
        res.status(200).json({ success: true, message, data });
    } else {
        res.status(400).json({ success: false, message: message || 'An error occurred' });
    }
};

exports.getHolidays = async (req, res) => {
    try {
        const data = await getHolidays();
        sendResponse(res, true, data, 'Holidays fetched successfully');
    } catch (error) {
        sendResponse(res, false, null, error.message);
    }
};
