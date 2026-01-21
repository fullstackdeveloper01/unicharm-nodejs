const choreiMessageService = require('../services/choreiMessageService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/chorei-messages/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'chorei-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all chorei messages
exports.getAllChoreiMessages = async (req, res) => {
    try {
        const messages = await choreiMessageService.getAllChoreiMessages();
        sendResponse(res, true, 'Chorei messages retrieved successfully', messages);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve chorei messages', null, { message: error.message });
    }
};

// Get chorei message by ID
exports.getChoreiMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await choreiMessageService.getChoreiMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Chorei message not found');
        }

        sendResponse(res, true, 'Chorei message retrieved successfully', message);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve chorei message', null, { message: error.message });
    }
};

// Create chorei message
exports.createChoreiMessage = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file'); // 'file' key for PDF

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, FileName } = req.body;
                let pdfPath = null;

                if (req.file) {
                    pdfPath = `/uploads/chorei-messages/${req.file.filename}`;
                }

                const message = await choreiMessageService.createChoreiMessage({
                    Title,
                    FileName,
                    PdfPath: pdfPath
                });

                res.status(201);
                sendResponse(res, true, 'Chorei message created successfully', message);
            } catch (error) {
                sendResponse(res, false, 'Failed to create chorei message', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update chorei message
exports.updateChoreiMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const message = await choreiMessageService.getChoreiMessageById(id);
                if (!message) {
                    return sendResponse(res, false, 'Chorei message not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.PdfPath = `/uploads/chorei-messages/${req.file.filename}`;
                }

                const updatedMessage = await choreiMessageService.updateChoreiMessage(message, updateData);
                sendResponse(res, true, 'Chorei message updated successfully', updatedMessage);
            } catch (error) {
                sendResponse(res, false, 'Failed to update chorei message', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete chorei message (soft delete)
exports.deleteChoreiMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await choreiMessageService.getChoreiMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Chorei message not found');
        }

        await choreiMessageService.deleteChoreiMessage(message);
        sendResponse(res, true, 'Chorei message deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete chorei message', null, { message: error.message });
    }
};
