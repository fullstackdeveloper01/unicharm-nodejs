
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { CompanyImage } = require('../../models/employee/intra');



/**
 * Get all slider images (from CompanyImages)
 * @returns {Promise<Array>} List of slider images
 */
const getAllSliderImages = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };
    if (search) whereClause.Title = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await CompanyImage.findAndCountAll(queryOptions);
};

/**
 * Get slider image by ID
 * @param {number} id - Slider image ID
 * @returns {Promise<Object>} Slider image
 */
const getSliderImageById = async (id) => {
    return await CompanyImage.findByPk(id);
};

/**
 * Create slider image (CompanyImage)
 * @param {Object} data - Slider image data { ImageName, Image }
 * @returns {Promise<Object>} Created slider image
 */
const createSliderImage = async (data) => {
    const imageData = {
        ImageName: data.ImageName,
        Type: data.Type,
        ShowType: data.ShowType,
        ImagePath: data.Image, // Map 'Image' input to 'ImagePath' column
        CreatedOn: new Date(),
        IsDeleted: false
    };
    return await CompanyImage.create(imageData);
};

/**
 * Update slider image
 * @param {Object} imageInstance - CompanyImage instance
 * @param {Object} data - Update data { ImageName, Image }
 * @returns {Promise<Object>} Updated slider image
 */
const updateSliderImage = async (imageInstance, data) => {
    const updateData = {};
    if (data.ImageName) updateData.ImageName = data.ImageName;
    if (data.Type) updateData.Type = data.Type;
    if (data.ShowType) updateData.ShowType = data.ShowType;
    if (data.Image) updateData.ImagePath = data.Image; // Map 'Image' input to 'ImagePath'

    return await imageInstance.update(updateData);
};

/**
 * Delete slider image (soft delete)
 * @param {Object} imageInstance - CompanyImage instance
 * @returns {Promise<Object>} Deleted slider image
 */
const deleteSliderImage = async (imageInstance) => {
    return await imageInstance.update({ IsDeleted: true });
};

// -----------------------------
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
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all slider images
exports.getAllSliderImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllSliderImages(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        // Construct full image URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const rows = result.rows.map(row => {
            const data = row.getDataValue ? row.get({ plain: true }) : row;
            if (data.ImagePath && !data.ImagePath.startsWith('http')) {
                data.ImagePath = `${baseUrl}${data.ImagePath}`;
            }
            return data;
        });

        sendResponse(res, true, 'Slider images retrieved successfully', rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve slider images', null, { message: error.message });
    }
};

// Get slider image by ID
exports.getSliderImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const sliderImage = await getSliderImageById(id);

        if (!sliderImage) {
            return sendResponse(res, false, 'Slider image not found');
        }

        const data = sliderImage.getDataValue ? sliderImage.get({ plain: true }) : sliderImage;
        if (data.ImagePath && !data.ImagePath.startsWith('http')) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            data.ImagePath = `${baseUrl}${data.ImagePath}`;
        }

        sendResponse(res, true, 'Slider image retrieved successfully', data);
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
                        const sliderImage = await createSliderImage({
                            ImageName: Title || file.originalname,
                            Type: Title,
                            ShowType: ShowType,
                            Image: `/uploads/slider-images/${file.filename}`
                        });
                        createdSliderImages.push(sliderImage);
                    }
                } else if (Title) {
                    // CustomImage `Image` is allowNull: true.
                    const sliderImage = await createSliderImage({
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
                const imageInstance = await getSliderImageById(id);

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

                const updatedSliderImage = await updateSliderImage(imageInstance, updateData);
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
        const imageInstance = await getSliderImageById(id);

        if (!imageInstance) {
            return sendResponse(res, false, 'Slider image not found');
        }

        await deleteSliderImage(imageInstance);
        sendResponse(res, true, 'Slider image deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete slider image', null, { message: error.message });
    }
};
