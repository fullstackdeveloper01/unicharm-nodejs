const newsService = require('../../services/superadmin/newsService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

        const result = await newsService.getAllNews(page, limit, search);

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
        const newsItem = await newsService.getNewsById(id);

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

                const news = await newsService.createNews({
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
                const news = await newsService.getNewsById(id);
                if (!news) {
                    return sendResponse(res, false, 'News not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/news/${req.file.filename}`;
                }

                const updatedNews = await newsService.updateNews(news, updateData);
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
        const news = await newsService.getNewsById(id);

        if (!news) {
            return sendResponse(res, false, 'News not found');
        }

        await newsService.deleteNews(news);
        sendResponse(res, true, 'News deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete news', null, { message: error.message });
    }
};
