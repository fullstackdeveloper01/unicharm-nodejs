const productService = require('../../services/superadmin/productService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

        const result = await productService.getAllProducts(page, limit, search);

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
            if (data.UserPhoto && !data.UserPhoto.startsWith('http')) {
                data.UserPhoto = `${baseUrl}${data.UserPhoto}`;
            }
            data.Image = data.UserPhoto;
            return data;
        });

        sendResponse(res, true, 'Products retrieved successfully', rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve products', null, { message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return sendResponse(res, false, 'Product not found');
        }

        const data = product.getDataValue ? product.get({ plain: true }) : product;
        if (data.UserPhoto && !data.UserPhoto.startsWith('http')) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            data.UserPhoto = `${baseUrl}${data.UserPhoto}`;
        }
        data.Image = data.UserPhoto;

        sendResponse(res, true, 'Product retrieved successfully', data);
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

                const product = await productService.createProduct({
                    Name,
                    Description,
                    UserPhoto: userPhoto
                });

                const data = product.getDataValue ? product.get({ plain: true }) : product;
                if (data.UserPhoto && !data.UserPhoto.startsWith('http')) {
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    data.UserPhoto = `${baseUrl}${data.UserPhoto}`;
                }
                data.Image = data.UserPhoto;

                res.status(201);
                sendResponse(res, true, 'Product created successfully', data);
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
                const product = await productService.getProductById(id);
                if (!product) {
                    return sendResponse(res, false, 'Product not found');
                }

                const updateData = { ...req.body };

                if (req.files && req.files.length > 0) {
                    const file = req.files[0];
                    console.log('DEBUG: Uploaded file field name:', file.fieldname);
                    updateData.UserPhoto = `/uploads/products/${file.filename}`;
                }

                const updatedProduct = await productService.updateProduct(product, updateData);
                const data = updatedProduct.getDataValue ? updatedProduct.get({ plain: true }) : updatedProduct;
                if (data.UserPhoto && !data.UserPhoto.startsWith('http')) {
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    data.UserPhoto = `${baseUrl}${data.UserPhoto}`;
                }
                data.Image = data.UserPhoto;

                sendResponse(res, true, 'Product updated successfully', data);
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
        const product = await productService.getProductById(id);

        if (!product) {
            return sendResponse(res, false, 'Product not found');
        }

        await productService.deleteProduct(product);
        sendResponse(res, true, 'Product deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete product', null, { message: error.message });
    }
};
