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
    if (data.Title) {
        const existing = await PhotoGallery.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Gallery with this title already exists');
        }
    }
    if (data.AdditionalImages && typeof data.AdditionalImages !== 'string') {
        data.AdditionalImages = JSON.stringify(data.AdditionalImages);
    }
    return await PhotoGallery.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

exports.updatePhotoGallery = async (gallery, data) => {
    if (data.Title && data.Title !== gallery.Title) {
        const existing = await PhotoGallery.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: gallery.Id }
            }
        });
        if (existing) {
            throw new Error('Gallery with this title already exists');
        }
    }

    // Handle Image replacement
    if (data.MainImage && gallery.MainImage && data.MainImage !== gallery.MainImage) {
        if (fs.existsSync(gallery.MainImage.replace('/', ''))) {
            try {
                fs.unlinkSync(gallery.MainImage.replace('/', ''));
            } catch (e) { console.error('Error deleting old image', e); }
        }
    }

    if (data.AdditionalImages && typeof data.AdditionalImages !== 'string') {
        data.AdditionalImages = JSON.stringify(data.AdditionalImages);
    }

    return await gallery.update(data);
};

exports.deletePhotoGallery = async (gallery) => {
    return await gallery.update({ IsDeleted: true });
};
