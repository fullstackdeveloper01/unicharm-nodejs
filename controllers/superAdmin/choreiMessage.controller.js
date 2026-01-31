
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { ChoreiMessage } = require('../../models/superAdmin');




/**
 * Get all chorei messages
 * @returns {Promise<Array>} List of chorei messages
 */
const getAllChoreiMessages = async (page = 1, limit = null, search = '') => {
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

    return await ChoreiMessage.findAndCountAll(queryOptions);
};

/**
 * Get chorei message by ID
 * @param {number} id - Chorei message ID
 * @returns {Promise<Object>} Chorei message
 */
const getChoreiMessageById = async (id) => {
    return await ChoreiMessage.findByPk(id);
};

/**
 * Create chorei message
 * @param {Object} data - Chorei message data
 * @returns {Promise<Object>} Created chorei message
 */
const createChoreiMessage = async (data) => {
    return await ChoreiMessage.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update chorei message
 * @param {Object} choreiMessage - Chorei message instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated chorei message
 */
const updateChoreiMessage = async (choreiMessage, data) => {
    // Handle file replacement
    if (data.PdfPath && choreiMessage.PdfPath && data.PdfPath !== choreiMessage.PdfPath) {
        if (fs.existsSync(choreiMessage.PdfPath.replace('/', ''))) {
            try {
                fs.unlinkSync(choreiMessage.PdfPath.replace('/', ''));
            } catch (e) { console.error('Error deleting old chorei message PDF', e); }
        }
    }
    return await choreiMessage.update(data);
};

/**
 * Delete chorei message (soft delete)
 * @param {Object} choreiMessage - Chorei message instance
 * @returns {Promise<Object>} Deleted chorei message
 */
const deleteChoreiMessage = async (choreiMessage) => {
    return await choreiMessage.update({ IsDeleted: true });
};

// -----------------------------

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
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all chorei messages
exports.getAllChoreiMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllChoreiMessages(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Chorei messages retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve chorei messages', null, { message: error.message });
    }
};

// Get chorei message by ID
exports.getChoreiMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await getChoreiMessageById(id);

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

                const message = await createChoreiMessage({
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
                const message = await getChoreiMessageById(id);
                if (!message) {
                    return sendResponse(res, false, 'Chorei message not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.PdfPath = `/uploads/chorei-messages/${req.file.filename}`;
                }

                const updatedMessage = await updateChoreiMessage(message, updateData);
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
        const message = await getChoreiMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Chorei message not found');
        }

        await deleteChoreiMessage(message);
        sendResponse(res, true, 'Chorei message deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete chorei message', null, { message: error.message });
    }
};
