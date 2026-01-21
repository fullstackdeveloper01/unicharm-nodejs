const db = require('../models');
const { Notice, Role } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all notices
 * @returns {Promise<Array>} List of notices
 */
exports.getAllNotices = async () => {
    return await Notice.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        include: [
            { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    });
};

/**
 * Get notice by ID
 * @param {number} id - Notice ID
 * @returns {Promise<Object>} Notice
 */
exports.getNoticeById = async (id) => {
    return await Notice.findByPk(id, {
        include: [
            { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
        ]
    });
};

/**
 * Create notice
 * @param {Object} data - Notice data
 * @returns {Promise<Object>} Created notice
 */
exports.createNotice = async (data) => {
    return await Notice.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update notice
 * @param {Object} notice - Notice instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated notice
 */
exports.updateNotice = async (notice, data) => {
    // Handle file replacement
    if (data.Image && notice.Image && data.Image !== notice.Image) {
        if (fs.existsSync(notice.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(notice.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old notice image', e); }
        }
    }
    return await notice.update(data);
};

/**
 * Delete notice (soft delete)
 * @param {Object} notice - Notice instance
 * @returns {Promise<Object>} Deleted notice
 */
exports.deleteNotice = async (notice) => {
    return await notice.update({ IsDeleted: true });
};
