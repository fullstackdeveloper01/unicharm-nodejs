
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// --- Business Logic (Merged) ---

const { CustomImage, Sequelize } = require('../../models/employee/intra');

const { Op } = Sequelize;


/**
 * Get all popup images (from CustomImages)
 * @returns {Promise<Array>} List of popup images
 */
const getAllPopupImages = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        IsDeleted: { [Op.or]: [false, null] }
    };

    if (search) {
        whereClause.Title = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await CustomImage.findAndCountAll(queryOptions);
};

/**
 * Get popup image by ID
 * @param {number} id - Popup image ID
 * @returns {Promise<Object>} Popup image
 */
const getPopupImageById = async (id) => {
    return await CustomImage.findByPk(id);
};

/**
 * Create popup image (CustomImage)
 * @param {Object} data - Popup image data { PopupType, ShowType, Image }
 * @returns {Promise<Object>} Created popup image
 */
const createPopupImage = async (data) => {
    return await CustomImage.create({
        Type: data.PopupType, // Map PopupType to Type
        ShowType: data.ShowType,
        Image: data.Image,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update popup image
 * @param {Object} popupImage - CustomImage instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated popup image
 */
const updatePopupImage = async (popupImage, data) => {
    // Handle file replacement
    if (data.Image && popupImage.Image && data.Image !== popupImage.Image) {
        if (fs.existsSync(popupImage.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(popupImage.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old popup image', e); }
        }
    }

    const updateData = {};
    if (data.PopupType) updateData.Type = data.PopupType;
    if (data.ShowType) updateData.ShowType = data.ShowType;
    if (data.Image) updateData.Image = data.Image;

    return await popupImage.update(updateData);
};

/**
 * Delete popup image (soft delete)
 * @param {Object} popupImage - CustomImage instance
 * @returns {Promise<Object>} Deleted popup image
 */
const deletePopupImage = async (popupImage) => {
    return await popupImage.update({ IsDeleted: true });
};

// -----------------------------

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
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all popup images
exports.getAllPopupImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllPopupImages(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const rows = result.rows.map(row => {
            const data = row.getDataValue ? row.get({ plain: true }) : row;
            if (data.Image && !data.Image.startsWith('http')) {
                data.Image = `${baseUrl}${data.Image}`;
            }
            return data;
        });

        sendResponse(res, true, 'Popup images retrieved successfully', rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve popup images', null, { message: error.message });
    }
};

// Get popup image by ID
exports.getPopupImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const popupImage = await getPopupImageById(id);

        if (!popupImage) {
            return sendResponse(res, false, 'Popup image not found');
        }

        const data = popupImage.getDataValue ? popupImage.get({ plain: true }) : popupImage;
        if (data.Image && !data.Image.startsWith('http')) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            data.Image = `${baseUrl}${data.Image}`;
        }

        sendResponse(res, true, 'Popup image retrieved successfully', data);
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
                console.log('Create Popup Payload:', req.body);
                console.log('Create Popup File:', req.file);
                const { PopupType, ShowType } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/popup-images/${req.file.filename}`;
                }

                const popupImage = await createPopupImage({
                    PopupType: PopupType || req.body.Type, // Handle potential key mismatch
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
                console.log(`Update Popup ${id} Payload:`, req.body);
                console.log(`Update Popup ${id} File:`, req.file);
                const popupImage = await getPopupImageById(id);
                if (!popupImage) {
                    return sendResponse(res, false, 'Popup image not found');
                }

                const { PopupType, ShowType } = req.body;
                const updateData = {
                    PopupType: PopupType || req.body.Type,
                    ShowType
                };

                if (req.file) {
                    updateData.Image = `/uploads/popup-images/${req.file.filename}`;
                }

                const updatedPopupImage = await updatePopupImage(popupImage, updateData);
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
        const popupImage = await getPopupImageById(id);

        if (!popupImage) {
            return sendResponse(res, false, 'Popup image not found');
        }

        await deletePopupImage(popupImage);
        sendResponse(res, true, 'Popup image deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete popup image', null, { message: error.message });
    }
};
