
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/photo-gallery/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all photo galleries
exports.getAllPhotoGalleries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllPhotoGalleries(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Photo galleries retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve photo galleries', null, { message: error.message });
    }
};

// Get photo gallery by ID
exports.getPhotoGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await getPhotoGalleryById(id);

        if (!gallery) {
            return sendResponse(res, false, 'Photo gallery not found');
        }

        sendResponse(res, true, 'Photo gallery retrieved successfully', gallery);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve photo gallery', null, { message: error.message });
    }
};

// Create photo gallery
exports.createPhotoGallery = async (req, res) => {
    try {
        const uploadMiddleware = upload.any();

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title } = req.body;
                let mainImagePath = null;
                let additionalImagesPaths = [];

                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        console.log('DEBUG: PhotoGallery Upload field:', file.fieldname);
                        if (file.fieldname.toLowerCase().includes('main')) {
                            mainImagePath = `/uploads/photo-gallery/${file.filename}`;
                        } else if (file.fieldname.toLowerCase().includes('additional')) {
                            additionalImagesPaths.push(`/uploads/photo-gallery/${file.filename}`);
                        } else {
                            // Fallback logic if needed, e.g. first file is main, others additional?
                            // For now, assume explicit naming, or maybe log it.
                        }
                    });

                    // Fallback: If no explicit 'main', take first file?
                    if (!mainImagePath && req.files.length > 0) {
                        // mainImagePath = `/uploads/photo-gallery/${req.files[0].filename}`; 
                        // Be careful with fallback. Let's stick to field matching.
                    }
                }

                const gallery = await createPhotoGallery({
                    Title,
                    MainImage: mainImagePath,
                    AdditionalImages: additionalImagesPaths
                });

                res.status(201);
                sendResponse(res, true, 'Photo gallery created successfully', gallery);
            } catch (error) {
                sendResponse(res, false, 'Failed to create photo gallery', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update photo gallery
exports.updatePhotoGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.any();

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const gallery = await getPhotoGalleryById(id);
                if (!gallery) {
                    return sendResponse(res, false, 'Photo gallery not found');
                }

                // Need instance for update
                
                const galleryInstance = await db.PhotoGallery.findByPk(id);

                const updateData = { ...req.body };

                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        console.log('DEBUG: PhotoGallery Update field:', file.fieldname);
                        if (file.fieldname.toLowerCase().includes('main')) {
                            updateData.MainImage = `/uploads/photo-gallery/${file.filename}`;
                        } else if (file.fieldname.toLowerCase().includes('additional')) {
                            // Handle appending logic
                            let currentAdditional = [];
                            try {
                                currentAdditional = JSON.parse(galleryInstance.AdditionalImages || '[]');
                            } catch (e) { }
                            // We append new file to list. 
                            // NOTE: Logic here must handle 'is this a NEW list or APPEND?'
                            // In create, we start fresh. Here we might be appending.
                            // Wait, my previous create logic pushed to a local array.
                            // Here I need to accumulate new paths.

                            if (!updateData.newAdditionalImages) updateData.newAdditionalImages = [];
                            updateData.newAdditionalImages.push(`/uploads/photo-gallery/${file.filename}`);
                        }
                    });
                }

                // Merge new additional images with existing
                let finalAdditionalImages = [];

                // 1. Determine base existing images
                if (req.body.ExistingAdditionalImages) {
                    try {
                        finalAdditionalImages = JSON.parse(req.body.ExistingAdditionalImages);
                    } catch (e) { console.error("Error parsing ExistingAdditionalImages", e); }
                } else {
                    // Fallback to DB state if not provided in request
                    try {
                        finalAdditionalImages = JSON.parse(galleryInstance.AdditionalImages || '[]');
                    } catch (e) { }
                }

                // 2. Append new images if any
                if (updateData.newAdditionalImages && updateData.newAdditionalImages.length > 0) {
                    finalAdditionalImages = [...finalAdditionalImages, ...updateData.newAdditionalImages];
                    delete updateData.newAdditionalImages;
                }

                // 3. Set the update data
                updateData.AdditionalImages = finalAdditionalImages;

                // If Title is updated, it's in updateData spread

                const updatedGallery = await updatePhotoGallery(galleryInstance, updateData);
                sendResponse(res, true, 'Photo gallery updated successfully', updatedGallery);
            } catch (error) {
                sendResponse(res, false, 'Failed to update photo gallery', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete photo gallery (soft delete)
exports.deletePhotoGallery = async (req, res) => {
    try {
        const { id } = req.params;
        // We need model instance
        const db = require('../../models/superAdmin');
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { PhotoGallery } = require('../../models/superAdmin');




/**
 * Get all photo galleries
 * @returns {Promise<Array>} List of photo galleries
 */
const getAllPhotoGalleries = async (page = 1, limit = null, search = '') => {
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

const getPhotoGalleryById = async (id) => {
    return await PhotoGallery.findByPk(id);
};

const createPhotoGallery = async (data) => {
    return await PhotoGallery.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

const updatePhotoGallery = async (gallery, data) => {
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

const deletePhotoGallery = async (gallery) => {
    return await gallery.update({ IsDeleted: true });
};

// -----------------------------
        const galleryInstance = await db.PhotoGallery.findByPk(id);

        if (!galleryInstance) {
            return sendResponse(res, false, 'Photo gallery not found');
        }

        await deletePhotoGallery(galleryInstance);
        sendResponse(res, true, 'Photo gallery deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete photo gallery', null, { message: error.message });
    }
};
