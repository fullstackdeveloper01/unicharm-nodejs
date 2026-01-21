const photoGalleryService = require('../services/photoGalleryService');
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
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all photo galleries
exports.getAllPhotoGalleries = async (req, res) => {
    try {
        const galleries = await photoGalleryService.getAllPhotoGalleries();
        sendResponse(res, true, 'Photo galleries retrieved successfully', galleries);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve photo galleries', null, { message: error.message });
    }
};

// Get photo gallery by ID
exports.getPhotoGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await photoGalleryService.getPhotoGalleryById(id);

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

                const gallery = await photoGalleryService.createPhotoGallery({
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
                const gallery = await photoGalleryService.getPhotoGalleryById(id);
                if (!gallery) {
                    return sendResponse(res, false, 'Photo gallery not found');
                }

                // Need instance for update
                const db = require('../models');
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
                if (updateData.newAdditionalImages && updateData.newAdditionalImages.length > 0) {
                    let currentAdditional = [];
                    try {
                        currentAdditional = JSON.parse(galleryInstance.AdditionalImages || '[]');
                    } catch (e) { }
                    updateData.AdditionalImages = [...currentAdditional, ...updateData.newAdditionalImages];
                    delete updateData.newAdditionalImages;
                }

                // If Title is updated, it's in updateData spread

                const updatedGallery = await photoGalleryService.updatePhotoGallery(galleryInstance, updateData);
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
        const db = require('../models');
        const galleryInstance = await db.PhotoGallery.findByPk(id);

        if (!galleryInstance) {
            return sendResponse(res, false, 'Photo gallery not found');
        }

        await photoGalleryService.deletePhotoGallery(galleryInstance);
        sendResponse(res, true, 'Photo gallery deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete photo gallery', null, { message: error.message });
    }
};
