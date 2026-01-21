const db = require('../models');
const { News } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all news
 * @returns {Promise<Array>} List of news
 */
exports.getAllNews = async () => {
    return await News.findAll({
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
