const db = require('../../models');
const { Notice, Role } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all notices
 * @returns {Promise<Array>} List of notices
 */
exports.getAllNotices = async (page = 1, limit = null, search = '') => {
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
            { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Notice.findAndCountAll(queryOptions);
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
    const existing = await Notice.findOne({
        where: {
            Title: data.Title,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });

    if (existing) {
        throw new Error('Notice with this title already exists');
    }
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
    if (data.Title && data.Title !== notice.Title) {
        const existing = await Notice.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: notice.Id }
            }
        });

        if (existing) {
            throw new Error('Notice with this title already exists');
        }
    }
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
