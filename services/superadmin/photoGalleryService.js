const db = require('../../models');
const { PhotoGallery } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all photo galleries
 * @returns {Promise<Array>} List of photo galleries
 */
exports.getAllPhotoGalleries = async (page = 1, limit = null, search = '') => {
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

    const { count, rows } = await PhotoGallery.findAndCountAll(queryOptions);

    // Parse AdditionalImages JSON for each gallery
    const mappedRows = rows.map(gallery => {
        const plainGallery = gallery.get({ plain: true });
        try {
            plainGallery.AdditionalImages = JSON.parse(plainGallery.AdditionalImages || '[]');
        } catch (e) {
            plainGallery.AdditionalImages = [];
        }
        return plainGallery;
    });

    return { count, rows: mappedRows };
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
