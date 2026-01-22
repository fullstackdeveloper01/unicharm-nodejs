const wallService = require('../services/wallService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/walls/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'wall-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all walls
exports.getAllWalls = async (req, res) => {
    try {
        const walls = await wallService.getAllWalls();
        sendResponse(res, true, 'Walls retrieved successfully', walls);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve walls', null, { message: error.message });
    }
};

// Get wall by ID
exports.getWallById = async (req, res) => {
    try {
        const { id } = req.params;
        const wall = await wallService.getWallById(id);

        if (!wall) {
            return sendResponse(res, false, 'Wall not found');
        }

        sendResponse(res, true, 'Wall retrieved successfully', wall);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve wall', null, { message: error.message });
    }
};

// Create wall
exports.createWall = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, Description, AddedBy } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/walls/${req.file.filename}`;
                }

                const wall = await wallService.createWall({
                    Title,
                    Description,
                    AddedBy,
                    Image: imagePath
                });

                res.status(201);
                sendResponse(res, true, 'Wall created successfully', wall);
            } catch (error) {
                sendResponse(res, false, 'Failed to create wall', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update wall
exports.updateWall = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const wall = await wallService.getWallById(id);
                if (!wall) {
                    return sendResponse(res, false, 'Wall not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/walls/${req.file.filename}`;
                }

                const updatedWall = await wallService.updateWall(wall, updateData);
                sendResponse(res, true, 'Wall updated successfully', updatedWall);
            } catch (error) {
                sendResponse(res, false, 'Failed to update wall', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete wall (soft delete)
exports.deleteWall = async (req, res) => {
    try {
        const { id } = req.params;
        const wall = await wallService.getWallById(id);

        if (!wall) {
            return sendResponse(res, false, 'Wall not found');
        }

        await wallService.deleteWall(wall);
        sendResponse(res, true, 'Wall deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete wall', null, { message: error.message });
    }
};
