const popupImageService = require('../services/popupImageService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/popup-images/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'popup-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all popup images
exports.getAllPopupImages = async (req, res) => {
    try {
        const popupImages = await popupImageService.getAllPopupImages();
        sendResponse(res, true, 'Popup images retrieved successfully', popupImages);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve popup images', null, { message: error.message });
    }
};

// Get popup image by ID
exports.getPopupImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const popupImage = await popupImageService.getPopupImageById(id);

        if (!popupImage) {
            return sendResponse(res, false, 'Popup image not found');
        }

        sendResponse(res, true, 'Popup image retrieved successfully', popupImage);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve popup image', null, { message: error.message });
    }
};

// Create popup image
exports.createPopupImage = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file'); // 'file' key for image

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { PopupType, ShowType } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/popup-images/${req.file.filename}`;
                }

                const popupImage = await popupImageService.createPopupImage({
                    PopupType,
                    ShowType,
                    Image: imagePath
                });

                res.status(201);
                sendResponse(res, true, 'Popup image created successfully', popupImage);
            } catch (error) {
                sendResponse(res, false, 'Failed to create popup image', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update popup image
exports.updatePopupImage = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const popupImage = await popupImageService.getPopupImageById(id);
                if (!popupImage) {
                    return sendResponse(res, false, 'Popup image not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/popup-images/${req.file.filename}`;
                }

                const updatedPopupImage = await popupImageService.updatePopupImage(popupImage, updateData);
                sendResponse(res, true, 'Popup image updated successfully', updatedPopupImage);
            } catch (error) {
                sendResponse(res, false, 'Failed to update popup image', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete popup image (soft delete)
exports.deletePopupImage = async (req, res) => {
    try {
        const { id } = req.params;
        const popupImage = await popupImageService.getPopupImageById(id);

        if (!popupImage) {
            return sendResponse(res, false, 'Popup image not found');
        }

        await popupImageService.deletePopupImage(popupImage);
        sendResponse(res, true, 'Popup image deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete popup image', null, { message: error.message });
    }
};
