const db = require('../models');
const { PhotoGallery } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all photo galleries
 * @returns {Promise<Array>} List of photo galleries
 */
exports.getAllPhotoGalleries = async () => {
    const galleries = await PhotoGallery.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });

    // Parse AdditionalImages JSON for each gallery
    return galleries.map(gallery => {
        const plainGallery = gallery.get({ plain: true });
        try {
            plainGallery.AdditionalImages = JSON.parse(plainGallery.AdditionalImages || '[]');
        } catch (e) {
            plainGallery.AdditionalImages = [];
        }
        return plainGallery;
    });
};

/**
 * Get photo gallery by ID
 * @param {number} id - Photo gallery ID
 * @returns {Promise<Object>} Photo gallery
 */
exports.getPhotoGalleryById = async (id) => {
    const gallery = await PhotoGallery.findByPk(id);
    if (gallery) {
        const plainGallery = gallery.get({ plain: true });
        try {
            plainGallery.AdditionalImages = JSON.parse(plainGallery.AdditionalImages || '[]');
        } catch (e) {
            plainGallery.AdditionalImages = [];
        }
        return plainGallery;
    }
    return null;
};

/**
 * Create photo gallery
 * @param {Object} data - Photo gallery data
 * @returns {Promise<Object>} Created photo gallery
 */
exports.createPhotoGallery = async (data) => {
    // Ensure AdditionalImages is a JSON string
    const galleryData = {
        ...data,
        AdditionalImages: JSON.stringify(data.AdditionalImages || []),
        CreatedOn: new Date(),
        IsDeleted: false
    };
    return await PhotoGallery.create(galleryData);
};

/**
 * Update photo gallery
 * @param {Object} gallery - Photo gallery instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated photo gallery
 */
exports.updatePhotoGallery = async (gallery, data) => {
    // Handle MainImage replacement
    if (data.MainImage && gallery.MainImage && data.MainImage !== gallery.MainImage) {
        if (fs.existsSync(gallery.MainImage.replace('/', ''))) {
            try {
                fs.unlinkSync(gallery.MainImage.replace('/', ''));
            } catch (e) { console.error('Error deleting old main image', e); }
        }
    }

    // Handle AdditionalImages replacement
    // Note: Complex handling needed to delete removed images if strict cleanup required.
    // For now, simple update. 

    const updateData = { ...data };
    if (updateData.AdditionalImages) {
        updateData.AdditionalImages = JSON.stringify(updateData.AdditionalImages);
    }

    return await gallery.update(updateData);
};

/**
 * Delete photo gallery (soft delete)
 * @param {Object} gallery - Photo gallery instance
 * @returns {Promise<Object>} Deleted photo gallery
 */
exports.deletePhotoGallery = async (gallery) => {
    return await gallery.update({ IsDeleted: true });
};
