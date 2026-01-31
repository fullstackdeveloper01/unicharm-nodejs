
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Product } = require('../../models/superAdmin');




const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const transformProduct = (product) => {
    if (!product) return null;
    const json = product.toJSON ? product.toJSON() : product;
    if (json.UserPhoto && !json.UserPhoto.startsWith('http')) {
        json.UserPhoto = `${baseUrl}${json.UserPhoto}`;
    }
    return json;
};

/**
 * Get all products
 * @returns {Promise<Array>} List of products
 */
const getAllProducts = async (page = 1, limit = null, search = '') => {
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

    const { count, rows } = await Product.findAndCountAll(queryOptions);
    return { count, rows: rows.map(exports.transformProduct) };
};

/**
 * Get product by ID (Returns Sequelize Instance)
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Product Instance
 */
const getProductById = async (id) => {
    return await Product.findByPk(id);
};

/**
 * Create product
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Created product
 */
const createProduct = async (data) => {
    const product = await Product.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
    return exports.transformProduct(product);
};

/**
 * Update product
 * @param {Object} product - Product instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated product
 */
const updateProduct = async (product, data) => {
    // Handle file replacement
    if (data.UserPhoto && product.UserPhoto && data.UserPhoto !== product.UserPhoto) {
        if (fs.existsSync(product.UserPhoto.replace('/', ''))) {
            try {
                fs.unlinkSync(product.UserPhoto.replace('/', ''));
            } catch (e) { console.error('Error deleting old product photo', e); }
        }
    }
    const updatedProduct = await product.update(data);
    return exports.transformProduct(updatedProduct);
};

/**
 * Delete product (soft delete)
 * @param {Object} product - Product instance
 * @returns {Promise<Object>} Deleted product
 */
const deleteProduct = async (product) => {
    return await product.update({ IsDeleted: true });
};

// -----------------------------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/products/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllProducts(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Products retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve products', null, { message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (!product) {
            return sendResponse(res, false, 'Product not found');
        }

        const transformedProduct = transformProduct(product);
        sendResponse(res, true, 'Product retrieved successfully', transformedProduct);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve product', null, { message: error.message });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const uploadMiddleware = upload.any();

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Name, Description } = req.body;
                let userPhoto = null;

                if (req.files && req.files.length > 0) {
                    const file = req.files[0];
                    console.log('DEBUG: Uploaded file field name:', file.fieldname);
                    userPhoto = `/uploads/products/${file.filename}`;
                }

                const product = await createProduct({
                    Name,
                    Description,
                    UserPhoto: userPhoto
                });

                res.status(201);
                sendResponse(res, true, 'Product created successfully', product);
            } catch (error) {
                sendResponse(res, false, 'Failed to create product', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.any();

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const product = await getProductById(id);
                if (!product) {
                    return sendResponse(res, false, 'Product not found');
                }

                const updateData = { ...req.body };

                if (req.files && req.files.length > 0) {
                    const file = req.files[0];
                    console.log('DEBUG: Uploaded file field name:', file.fieldname);
                    updateData.UserPhoto = `/uploads/products/${file.filename}`;
                }

                const updatedProduct = await updateProduct(product, updateData);
                sendResponse(res, true, 'Product updated successfully', updatedProduct);
            } catch (error) {
                sendResponse(res, false, 'Failed to update product', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete product (soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (!product) {
            return sendResponse(res, false, 'Product not found');
        }

        await deleteProduct(product);
        sendResponse(res, true, 'Product deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete product', null, { message: error.message });
    }
};
