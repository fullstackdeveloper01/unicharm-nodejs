const db = require('../models');
const { ChoreiMessage } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all chorei messages
 * @returns {Promise<Array>} List of chorei messages
 */
exports.getAllChoreiMessages = async () => {
    return await ChoreiMessage.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });
};

/**
 * Get chorei message by ID
 * @param {number} id - Chorei message ID
 * @returns {Promise<Object>} Chorei message
 */
exports.getChoreiMessageById = async (id) => {
    return await ChoreiMessage.findByPk(id);
};

/**
 * Create chorei message
 * @param {Object} data - Chorei message data
 * @returns {Promise<Object>} Created chorei message
 */
exports.createChoreiMessage = async (data) => {
    return await ChoreiMessage.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update chorei message
 * @param {Object} choreiMessage - Chorei message instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated chorei message
 */
exports.updateChoreiMessage = async (choreiMessage, data) => {
    // Handle file replacement
    if (data.PdfPath && choreiMessage.PdfPath && data.PdfPath !== choreiMessage.PdfPath) {
        if (fs.existsSync(choreiMessage.PdfPath.replace('/', ''))) {
            try {
                fs.unlinkSync(choreiMessage.PdfPath.replace('/', ''));
            } catch (e) { console.error('Error deleting old chorei message PDF', e); }
        }
    }
    return await choreiMessage.update(data);
};

/**
 * Delete chorei message (soft delete)
 * @param {Object} choreiMessage - Chorei message instance
 * @returns {Promise<Object>} Deleted chorei message
 */
exports.deleteChoreiMessage = async (choreiMessage) => {
    return await choreiMessage.update({ IsDeleted: true });
};
