const holidayService = require('../../services/employee/holiday.service');

const sendResponse = (res, success, data = null, message = '') => {
    if (success) {
        res.status(200).json({ success: true, message, data });
    } else {
        res.status(400).json({ success: false, message: message || 'An error occurred' });
    }
};

exports.getHolidays = async (req, res) => {
    try {
        const data = await holidayService.getHolidays();
        sendResponse(res, true, data, 'Holidays fetched successfully');
    } catch (error) {
        sendResponse(res, false, null, error.message);
    }
};
