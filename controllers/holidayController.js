const holidayService = require('../services/holidayService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all holidays
exports.getAllHolidays = async (req, res) => {
    try {
        const holidays = await holidayService.getAllHolidays();
        sendResponse(res, true, 'Holidays retrieved successfully', holidays);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve holidays', null, { message: error.message });
    }
};

// Get holiday by ID
exports.getHolidayById = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await holidayService.getHolidayById(id);

        if (!holiday) {
            return sendResponse(res, false, 'Holiday not found');
        }

        sendResponse(res, true, 'Holiday retrieved successfully', holiday);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve holiday', null, { message: error.message });
    }
};

// Create holiday
exports.createHoliday = async (req, res) => {
    try {
        const { Name, HolidayDate } = req.body;

        if (!Name || !HolidayDate) {
            return sendResponse(res, false, 'Name and Date are required');
        }

        const holiday = await holidayService.createHoliday({ Name, HolidayDate });
        res.status(201);
        sendResponse(res, true, 'Holiday created successfully', holiday);
    } catch (error) {
        sendResponse(res, false, 'Failed to create holiday', null, { message: error.message });
    }
};

// Update holiday
exports.updateHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, HolidayDate } = req.body;

        const holiday = await holidayService.getHolidayById(id);
        if (!holiday) {
            return sendResponse(res, false, 'Holiday not found');
        }

        const updatedHoliday = await holidayService.updateHoliday(holiday, { Name, HolidayDate });
        sendResponse(res, true, 'Holiday updated successfully', updatedHoliday);
    } catch (error) {
        sendResponse(res, false, 'Failed to update holiday', null, { message: error.message });
    }
};

// Delete holiday (soft delete)
exports.deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await holidayService.getHolidayById(id);

        if (!holiday) {
            return sendResponse(res, false, 'Holiday not found');
        }

        await holidayService.deleteHoliday(holiday);
        sendResponse(res, true, 'Holiday deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete holiday', null, { message: error.message });
    }
};
