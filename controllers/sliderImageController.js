const sliderImageService = require('../services/sliderImageService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');
// const { CustomImage } = db; // Removed as we use service abstraction

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/slider-images/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all slider images
exports.getAllSliderImages = async (req, res) => {
    try {
        const sliderImages = await sliderImageService.getAllSliderImages();
        sendResponse(res, true, 'Slider images retrieved successfully', sliderImages);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve slider images', null, { message: error.message });
    }
};

// Get slider image by ID
exports.getSliderImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const sliderImage = await sliderImageService.getSliderImageById(id);

        if (!sliderImage) {
            return sendResponse(res, false, 'Slider image not found');
        }

        sendResponse(res, true, 'Slider image retrieved successfully', sliderImage);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve slider image', null, { message: error.message });
    }
};

// Create slider image
// Create slider image
exports.createSliderImage = async (req, res) => {
    try {
        const uploadMiddleware = upload.array('additionalImages', 10);

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, ShowType } = req.body;
                const createdSliderImages = [];

                if (req.files && req.files.length > 0) {
                    for (const file of req.files) {
                        const sliderImage = await sliderImageService.createSliderImage({
                            ImageName: Title || file.originalname,
                            Type: Title,
                            ShowType: ShowType,
                            Image: `/uploads/slider-images/${file.filename}`
                        });
                        createdSliderImages.push(sliderImage);
                    }
                } else if (Title) {
                    // CustomImage `Image` is allowNull: true.
                    const sliderImage = await sliderImageService.createSliderImage({
                        ImageName: Title,
                        Type: Title,
                        ShowType: ShowType,
                        Image: null
                    });
                    createdSliderImages.push(sliderImage);
                }

                res.status(201);
                sendResponse(res, true, 'Slider images created successfully', createdSliderImages);
            } catch (error) {
                sendResponse(res, false, 'Failed to create slider images', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update slider image
exports.updateSliderImage = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.array('additionalImages', 1); // Expecting single update mostly

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                // Fetch instance to update
                const imageInstance = await sliderImageService.getSliderImageById(id);

                if (!imageInstance) {
                    return sendResponse(res, false, 'Slider image not found');
                }

                const { Title, ShowType } = req.body;
                const updateData = {};

                if (Title) {
                    updateData.ImageName = Title;
                    updateData.Type = Title;
                }
                if (ShowType) {
                    updateData.ShowType = ShowType;
                }

                if (req.files && req.files.length > 0) {
                    const file = req.files[0];
                    updateData.Image = `/uploads/slider-images/${file.filename}`;
                }

                const updatedSliderImage = await sliderImageService.updateSliderImage(imageInstance, updateData);
                sendResponse(res, true, 'Slider image updated successfully', updatedSliderImage);
            } catch (error) {
                sendResponse(res, false, 'Failed to update slider image', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete slider image (soft delete)
exports.deleteSliderImage = async (req, res) => {
    try {
        const { id } = req.params;
        const imageInstance = await sliderImageService.getSliderImageById(id);

        if (!imageInstance) {
            return sendResponse(res, false, 'Slider image not found');
        }

        await sliderImageService.deleteSliderImage(imageInstance);
        sendResponse(res, true, 'Slider image deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete slider image', null, { message: error.message });
    }
};
