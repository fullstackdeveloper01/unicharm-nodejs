
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { News } = require('../../models/superAdmin');




/**
 * Get all news
 * @returns {Promise<Array>} List of news
 */
const getAllNews = async (page = 1, limit = null, search = '') => {
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

    return await News.findAndCountAll(queryOptions);
};

/**
 * Get news by ID
 * @param {number} id - News ID
 * @returns {Promise<Object>} News
 */
const getNewsById = async (id) => {
    return await News.findByPk(id);
};

/**
 * Create news
 * @param {Object} data - News data
 * @returns {Promise<Object>} Created news
 */
const createNews = async (data) => {
    return await News.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update news
 * @param {Object} news - News instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated news
 */
const updateNews = async (news, data) => {
    // Handle file replacement
    if (data.Image && news.Image && data.Image !== news.Image) {
        if (fs.existsSync(news.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(news.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old news image', e); }
        }
    }
    return await news.update(data);
};

/**
 * Delete news (soft delete)
 * @param {Object} news - News instance
 * @returns {Promise<Object>} Deleted news
 */
const deleteNews = async (news) => {
    return await news.update({ IsDeleted: true });
};

// -----------------------------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/news/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all news
exports.getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllNews(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'News retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve news', null, { message: error.message });
    }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const newsItem = await getNewsById(id);

        if (!newsItem) {
            return sendResponse(res, false, 'News not found');
        }

        sendResponse(res, true, 'News retrieved successfully', newsItem);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve news', null, { message: error.message });
    }
};

// Create news
exports.createNews = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file'); // 'file' key for image

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, Description } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/news/${req.file.filename}`;
                }

                const news = await createNews({
                    Title,
                    Description,
                    Image: imagePath
                });

                res.status(201);
                sendResponse(res, true, 'News created successfully', news);
            } catch (error) {
                sendResponse(res, false, 'Failed to create news', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update news
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const news = await getNewsById(id);
                if (!news) {
                    return sendResponse(res, false, 'News not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/news/${req.file.filename}`;
                }

                const updatedNews = await updateNews(news, updateData);
                sendResponse(res, true, 'News updated successfully', updatedNews);
            } catch (error) {
                sendResponse(res, false, 'Failed to update news', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete news (soft delete)
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await getNewsById(id);

        if (!news) {
            return sendResponse(res, false, 'News not found');
        }

        await deleteNews(news);
        sendResponse(res, true, 'News deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete news', null, { message: error.message });
    }
};
