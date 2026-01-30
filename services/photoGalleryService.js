const db = require('../models');
const { PhotoGallery } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all photo galleries
 * @returns {Promise<Array>} List of photo galleries
 */
exports.getAllPhotoGalleries = async () => {
    return await PhotoGallery.findAll({
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

exports.getPhotoGalleryById = async (id) => {
    return await PhotoGallery.findByPk(id);
};

exports.createPhotoGallery = async (data) => {
    return await PhotoGallery.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

exports.updatePhotoGallery = async (gallery, data) => {
    // Handle Image replacement
    if (data.Image && gallery.Image && data.Image !== gallery.Image) {
        if (fs.existsSync(gallery.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(gallery.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old image', e); }
        }
    }
    return await gallery.update(data);
};

exports.deletePhotoGallery = async (gallery) => {
    return await gallery.update({ IsDeleted: true });
};
