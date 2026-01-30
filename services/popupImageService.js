const db = require('../models');
const { CustomImage, Sequelize } = db;
const { Op } = Sequelize;
const fs = require('fs');

/**
 * Get all popup images (from CustomImages)
 * @returns {Promise<Array>} List of popup images
 */
exports.getAllPopupImages = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        IsDeleted: { [Op.or]: [false, null] }
    };

    if (search) {
        whereClause.Title = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await CustomImage.findAndCountAll(queryOptions);
};

/**
 * Get popup image by ID
 * @param {number} id - Popup image ID
 * @returns {Promise<Object>} Popup image
 */
exports.getPopupImageById = async (id) => {
    return await CustomImage.findByPk(id);
};

/**
 * Create popup image (CustomImage)
 * @param {Object} data - Popup image data { PopupType, ShowType, Image }
 * @returns {Promise<Object>} Created popup image
 */
exports.createPopupImage = async (data) => {
    return await CustomImage.create({
        Type: data.PopupType, // Map PopupType to Type
        ShowType: data.ShowType,
        Image: data.Image,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update popup image
 * @param {Object} popupImage - CustomImage instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated popup image
 */
exports.updatePopupImage = async (popupImage, data) => {
    // Handle file replacement
    if (data.Image && popupImage.Image && data.Image !== popupImage.Image) {
        if (fs.existsSync(popupImage.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(popupImage.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old popup image', e); }
        }
    }

    const updateData = {};
    if (data.PopupType) updateData.Type = data.PopupType;
    if (data.ShowType) updateData.ShowType = data.ShowType;
    if (data.Image) updateData.Image = data.Image;

    return await popupImage.update(updateData);
};

/**
 * Delete popup image (soft delete)
 * @param {Object} popupImage - CustomImage instance
 * @returns {Promise<Object>} Deleted popup image
 */
exports.deletePopupImage = async (popupImage) => {
    return await popupImage.update({ IsDeleted: true });
};
