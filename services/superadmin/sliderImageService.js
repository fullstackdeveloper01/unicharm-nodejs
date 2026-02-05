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
    if (data.ImageName) {
        const existing = await CompanyImage.findOne({
            where: {
                ImageName: data.ImageName,
                IsDeleted: false // Only check active records
            }
        });
        if (existing) {
            throw new Error('Slider Image with this name already exists');
        }
    }
    const imageData = {
        ImageName: data.ImageName,
        CreatedOn: data.CreatedOn ? new Date(data.CreatedOn) : new Date(),
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
    if (data.ImageName && data.ImageName !== imageInstance.ImageName) {
        const existing = await CompanyImage.findOne({
            where: {
                ImageName: data.ImageName,
                IsDeleted: false, // Only check active records
                Id: { [Op.ne]: imageInstance.Id }
            }
        });
        if (existing) {
            throw new Error('Slider Image with this name already exists');
        }
    }

    const updateData = {};
    if (data.ImageName) updateData.ImageName = data.ImageName;
    if (data.CreatedOn) updateData.CreatedOn = new Date(data.CreatedOn);
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
