const holidayService = require('../../services/superadmin/holidayService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all holidays
exports.getAllHolidays = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await holidayService.getAllHolidays(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Holidays retrieved successfully', result.rows, null, pagination);
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
