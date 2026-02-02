const db = require('../../models');
const { CompanyImage } = db;
const { Op } = require('sequelize');

/**
 * Get all slider images (from CompanyImages)
 * @returns {Promise<Array>} List of slider images
 */
exports.getAllSliderImages = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        IsDeleted: {
            [Op.or]: [
                { [Op.eq]: 0 },
                { [Op.eq]: false },
                { [Op.is]: null },
                { [Op.eq]: '0' },
                { [Op.eq]: 'false' }
            ]
        }
    };
    if (search) whereClause.Title = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await CompanyImage.findAndCountAll(queryOptions);
};

/**
 * Get slider image by ID
 * @param {number} id - Slider image ID
 * @returns {Promise<Object>} Slider image
 */
exports.getSliderImageById = async (id) => {
    return await CompanyImage.findByPk(id);
};

/**
 * Create slider image (CompanyImage)
 * @param {Object} data - Slider image data { ImageName, Image }
 * @returns {Promise<Object>} Created slider image
 */
exports.createSliderImage = async (data) => {
    const imageData = {
        ImageName: data.Type || data.ImageName, // Map Type to ImageName
        // ShowType mapped to CreatedOn
        CreatedOn: data.ShowType ? new Date(data.ShowType) : new Date(),
        ImagePath: data.Image, // Map 'Image' input to 'ImagePath' column
        IsDeleted: false
    };
    return await CompanyImage.create(imageData);
};

/**
 * Update slider image
 * @param {Object} imageInstance - CompanyImage instance
 * @param {Object} data - Update data { ImageName, Image }
 * @returns {Promise<Object>} Updated slider image
 */
exports.updateSliderImage = async (imageInstance, data) => {
    const updateData = {};
    // Map Type or ImageName to ImageName
    if (data.Type || data.ImageName) updateData.ImageName = data.Type || data.ImageName;

    // Map ShowType to CreatedOn
    if (data.ShowType) updateData.CreatedOn = new Date(data.ShowType);

    if (data.Image) updateData.ImagePath = data.Image; // Map 'Image' input to 'ImagePath'

    return await imageInstance.update(updateData);
};

/**
 * Delete slider image (soft delete)
 * @param {Object} imageInstance - CompanyImage instance
 * @returns {Promise<Object>} Deleted slider image
 */
exports.deleteSliderImage = async (imageInstance) => {
    return await imageInstance.update({ IsDeleted: true });
};
