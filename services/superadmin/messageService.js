const db = require('../../models');
const { Message } = db;
const { Op } = require('sequelize');

/**
 * Get all messages
 * @returns {Promise<Array>} List of messages
 */
exports.getAllMessages = async (page = 1, limit = null, search = '') => {
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
exports.getMessageById = async (id) => {
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
exports.createMessage = async (data) => {
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
exports.updateMessage = async (message, data) => {
    const updateData = { ...data };

    // Ensure AddedBy is updated if provided
    if (data.AddedBy !== undefined) {
        updateData.AddedBy = data.AddedBy;
    }

    await message.update(updateData);

    // Reload with associations to get updated data
    return await Message.findByPk(message.Id, {
        include: [
            { model: db.Role, as: 'role', attributes: ['Id', 'RoleName'] },
            { model: db.Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ]
    });
};

/**
 * Delete message (soft delete)
 * @param {Object} message - Message instance
 * @returns {Promise<Object>} Deleted message
 */
exports.deleteMessage = async (message) => {
    return await message.update({ IsDeleted: true });
};
