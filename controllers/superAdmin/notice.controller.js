
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Notice, Role } = require('../../models/superAdmin');




/**
 * Get all notices
 * @returns {Promise<Array>} List of notices
 */
const getAllNotices = async (page = 1, limit = null, search = '') => {
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
        include: [
            { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Notice.findAndCountAll(queryOptions);
};

/**
 * Get notice by ID
 * @param {number} id - Notice ID
 * @returns {Promise<Object>} Notice
 */
const getNoticeById = async (id) => {
    return await Notice.findByPk(id, {
        include: [
            { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
        ]
    });
};

/**
 * Create notice
 * @param {Object} data - Notice data
 * @returns {Promise<Object>} Created notice
 */
const createNotice = async (data) => {
    return await Notice.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update notice
 * @param {Object} notice - Notice instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated notice
 */
const updateNotice = async (notice, data) => {
    // Handle file replacement
    if (data.Image && notice.Image && data.Image !== notice.Image) {
        if (fs.existsSync(notice.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(notice.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old notice image', e); }
        }
    }
    return await notice.update(data);
};

/**
 * Delete notice (soft delete)
 * @param {Object} notice - Notice instance
 * @returns {Promise<Object>} Deleted notice
 */
const deleteNotice = async (notice) => {
    return await notice.update({ IsDeleted: true });
};

// -----------------------------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/notices/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'notice-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all notices
exports.getAllNotices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllNotices(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Notices retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve notices', null, { message: error.message });
    }
};

// Get notice by ID
exports.getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await getNoticeById(id);

        if (!notice) {
            return sendResponse(res, false, 'Notice not found');
        }

        sendResponse(res, true, 'Notice retrieved successfully', notice);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve notice', null, { message: error.message });
    }
};

// Create notice
exports.createNotice = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, description, Role, Date } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/notices/${req.file.filename}`;
                }

                const notice = await createNotice({
                    Title,
                    description,
                    Role,
                    Date,
                    Image: imagePath
                });

                res.status(201);
                sendResponse(res, true, 'Notice created successfully', notice);
            } catch (error) {
                sendResponse(res, false, 'Failed to create notice', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update notice
exports.updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const notice = await getNoticeById(id);
                if (!notice) {
                    return sendResponse(res, false, 'Notice not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/notices/${req.file.filename}`;
                }

                const updatedNotice = await updateNotice(notice, updateData);
                sendResponse(res, true, 'Notice updated successfully', updatedNotice);
            } catch (error) {
                sendResponse(res, false, 'Failed to update notice', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete notice (soft delete)
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await getNoticeById(id);

        if (!notice) {
            return sendResponse(res, false, 'Notice not found');
        }

        await deleteNotice(notice);
        sendResponse(res, true, 'Notice deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete notice', null, { message: error.message });
    }
};
