
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Policy } = require('../../models/superAdmin');




/**
 * Get all policies
 * @returns {Promise<Array>} List of policies
 */
const getAllPolicies = async (page = 1, limit = null, search = '') => {
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

    return await Policy.findAndCountAll(queryOptions);
};

/**
 * Get policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
const getPolicyById = async (id) => {
    return await Policy.findByPk(id);
};

/**
 * Create policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
const createPolicy = async (data) => {
    return await Policy.create({
        ...data,
        CreatedOn: new Date(),
        ModifiedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update policy
 * @param {Object} policy - Policy instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
const updatePolicy = async (policy, data) => {
    // Handle file replacement
    if (data.PdfPath && policy.PdfPath && data.PdfPath !== policy.PdfPath) {
        if (fs.existsSync(policy.PdfPath.replace('/', ''))) {
            try {
                fs.unlinkSync(policy.PdfPath.replace('/', ''));
            } catch (e) { console.error('Error deleting old policy pdf', e); }
        }
    }
    return await policy.update({
        ...data,
        ModifiedOn: new Date()
    });
};

/**
 * Delete policy (soft delete)
 * @param {Object} policy - Policy instance
 * @returns {Promise<Object>} Deleted policy
 */
const deletePolicy = async (policy) => {
    return await policy.update({ IsDeleted: true });
};

// -----------------------------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/policies/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'policy-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all policies
exports.getAllPolicies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllPolicies(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Policies retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policies', null, { message: error.message });
    }
};

// Get policy by ID
exports.getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await getPolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        sendResponse(res, true, 'Policy retrieved successfully', policy);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policy', null, { message: error.message });
    }
};

// Create policy
exports.createPolicy = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file'); // 'file' matches 'pdf' requirement conceptually, standardizing on 'file' key in FormData

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title } = req.body;
                let pdfPath = null;

                if (req.file) {
                    pdfPath = `/uploads/policies/${req.file.filename}`;
                }

                const policy = await createPolicy({
                    Title,
                    PdfPath: pdfPath
                });

                res.status(201);
                sendResponse(res, true, 'Policy created successfully', policy);
            } catch (error) {
                sendResponse(res, false, 'Failed to create policy', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update policy
exports.updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const policy = await getPolicyById(id);
                if (!policy) {
                    return sendResponse(res, false, 'Policy not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.PdfPath = `/uploads/policies/${req.file.filename}`;
                }

                const updatedPolicy = await updatePolicy(policy, updateData);
                sendResponse(res, true, 'Policy updated successfully', updatedPolicy);
            } catch (error) {
                sendResponse(res, false, 'Failed to update policy', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete policy (soft delete)
exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await getPolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        await deletePolicy(policy);
        sendResponse(res, true, 'Policy deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete policy', null, { message: error.message });
    }
};
