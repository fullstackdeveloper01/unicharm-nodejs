
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Message } = require('../../models/superAdmin');



/**
 * Get all messages
 * @returns {Promise<Array>} List of messages
 */
const getAllMessages = async (page = 1, limit = null, search = '') => {
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
        include: [
            { model: db.Role, as: 'role', attributes: ['Id', 'RoleName'] },
            { model: db.Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const { count, rows } = await Message.findAndCountAll(queryOptions);

    const mappedRows = rows.map(msg => {
        const m = msg.toJSON();
        const addedByName = m.addedBy ? `${m.addedBy.FirstName} ${m.addedBy.LastName || ''}`.trim() : '';
        const roleName = m.role ? m.role.RoleName : '';

        return {
            ...m,
            // Overwrite AddedBy with Name for display
            AddedBy: addedByName || m.AddedBy,
            AddedByName: addedByName,
            AddedById: m.AddedBy, // Preserve ID

            // Provide Role Name if needed 
            Role: roleName,
            RoleName: roleName
        };
    });

    return { count, rows: mappedRows };
};

/**
 * Get message by ID
 * @param {number} id - Message ID
 * @returns {Promise<Object>} Message
 */
const getMessageById = async (id) => {
    return await Message.findByPk(id, {
        include: [
            { model: db.Role, as: 'role', attributes: ['Id', 'RoleName'] },
            { model: db.Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ]
    });
};

/**
 * Create message
 * @param {Object} data - Message data
 * @returns {Promise<Object>} Created message
 */
const createMessage = async (data) => {
    return await Message.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update message
 * @param {Object} message - Message instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated message
 */
const updateMessage = async (message, data) => {
    return await message.update(data);
};

/**
 * Delete message (soft delete)
 * @param {Object} message - Message instance
 * @returns {Promise<Object>} Deleted message
 */
const deleteMessage = async (message) => {
    return await message.update({ IsDeleted: true });
};

// -----------------------------


// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const { count, rows } = await getAllMessages(page, limit, search);

        const pagination = {
            total: count,
            page: page,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1,
            hasNext: limit ? page * limit < count : false
        };

        res.json({
            success: true,
            message: 'Messages retrieved successfully',
            data: rows,
            pagination
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve messages', null, { message: error.message });
    }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await getMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Message not found');
        }

        sendResponse(res, true, 'Message retrieved successfully', message);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve message', null, { message: error.message });
    }
};

// Create message
exports.createMessage = async (req, res) => {
    try {
        const message = await createMessage(req.body);
        res.status(201);
        sendResponse(res, true, 'Message created successfully', message);
    } catch (error) {
        sendResponse(res, false, 'Failed to create message', null, { message: error.message });
    }
};

// Update message
exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await getMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Message not found');
        }

        const updatedMessage = await updateMessage(message, req.body);
        sendResponse(res, true, 'Message updated successfully', updatedMessage);
    } catch (error) {
        sendResponse(res, false, 'Failed to update message', null, { message: error.message });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await getMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Message not found');
        }

        await deleteMessage(message);
        sendResponse(res, true, 'Message deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete message', null, { message: error.message });
    }
};
