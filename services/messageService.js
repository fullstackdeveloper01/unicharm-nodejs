const db = require('../models');
const { Message } = db;
const { Op } = require('sequelize');

/**
 * Get all messages
 * @returns {Promise<Array>} List of messages
 */
exports.getAllMessages = async () => {
    const messages = await Message.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        include: [
            { model: db.Role, as: 'role', attributes: ['Id', 'RoleName'] },
            { model: db.Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    });

    return messages.map(msg => {
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
    return await message.update(data);
};

/**
 * Delete message (soft delete)
 * @param {Object} message - Message instance
 * @returns {Promise<Object>} Deleted message
 */
exports.deleteMessage = async (message) => {
    return await message.update({ IsDeleted: true });
};
