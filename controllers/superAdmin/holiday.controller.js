
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Holiday } = require('../../models/superAdmin');



/**
 * Get all holidays
 * @returns {Promise<Array>} List of holidays
 */
const getAllHolidays = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({ Title: { [Op.like]: `%${search}%` } });
    }

    const queryOptions = {
        where: whereClause,
        order: [['HolidayDate', 'ASC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Holiday.findAndCountAll(queryOptions);
};

/**
 * Get holiday by ID
 * @param {number} id - Holiday ID
 * @returns {Promise<Object>} Holiday
 */
const getHolidayById = async (id) => {
    return await Holiday.findByPk(id);
};

/**
 * Create holiday
 * @param {Object} data - Holiday data
 * @returns {Promise<Object>} Created holiday
 */
const createHoliday = async (data) => {
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
const updateHoliday = async (holiday, data) => {
    return await holiday.update(data);
};

/**
 * Delete holiday (soft delete)
 * @param {Object} holiday - Holiday instance
 * @returns {Promise<Object>} Deleted holiday
 */
const deleteHoliday = async (holiday) => {
    return await holiday.update({ IsDeleted: true });
};

// -----------------------------


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

        const result = await getAllHolidays(page, limit, search);

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
        const holiday = await getHolidayById(id);

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

        const holiday = await createHoliday({ Name, HolidayDate });
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

        const holiday = await getHolidayById(id);
        if (!holiday) {
            return sendResponse(res, false, 'Holiday not found');
        }

        const updatedHoliday = await updateHoliday(holiday, { Name, HolidayDate });
        sendResponse(res, true, 'Holiday updated successfully', updatedHoliday);
    } catch (error) {
        sendResponse(res, false, 'Failed to update holiday', null, { message: error.message });
    }
};

// Delete holiday (soft delete)
exports.deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await getHolidayById(id);

        if (!holiday) {
            return sendResponse(res, false, 'Holiday not found');
        }

        await deleteHoliday(holiday);
        sendResponse(res, true, 'Holiday deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete holiday', null, { message: error.message });
    }
};
