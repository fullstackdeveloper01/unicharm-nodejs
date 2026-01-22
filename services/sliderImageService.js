const db = require('../models');
const { CompanyImage } = db;

/**
 * Get all slider images (from CompanyImages)
 * @returns {Promise<Array>} List of slider images
 */
exports.getAllSliderImages = async () => {
    return await CompanyImage.findAll({
        where: {
            IsDeleted: false
        },
        order: [['CreatedOn', 'DESC']]
    });
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
        ImageName: data.ImageName,
        ImagePath: data.Image, // Map 'Image' input to 'ImagePath' column
        CreatedOn: new Date(),
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
    if (data.ImageName) updateData.ImageName = data.ImageName;
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
