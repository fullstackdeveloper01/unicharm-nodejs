const db = require('../../models');
const { News } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all news
 * @returns {Promise<Array>} List of news
 */
exports.getAllNews = async (page = 1, limit = null, search = '') => {
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
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await News.findAndCountAll(queryOptions);
};

/**
 * Get news by ID
 * @param {number} id - News ID
 * @returns {Promise<Object>} News
 */
exports.getNewsById = async (id) => {
    return await News.findByPk(id);
};

/**
 * Create news
 * @param {Object} data - News data
 * @returns {Promise<Object>} Created news
 */
exports.createNews = async (data) => {
    const existing = await News.findOne({
        where: {
            Title: data.Title,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });

    if (existing) {
        throw new Error('News with this title already exists');
    }
    return await News.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update news
 * @param {Object} news - News instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated news
 */
exports.updateNews = async (news, data) => {
    if (data.Title && data.Title !== news.Title) {
        const existing = await News.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: news.Id }
            }
        });

        if (existing) {
            throw new Error('News with this title already exists');
        }
    }
    // Handle file replacement
    if (data.Image && news.Image && data.Image !== news.Image) {
        if (fs.existsSync(news.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(news.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old news image', e); }
        }
    }
    return await news.update(data);
};

/**
 * Delete news (soft delete)
 * @param {Object} news - News instance
 * @returns {Promise<Object>} Deleted news
 */
exports.deleteNews = async (news) => {
    return await news.update({ IsDeleted: true });
};
