const policyService = require('../services/policyService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

        const result = await policyService.getAllPolicies(page, limit, search);

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
        const policy = await policyService.getPolicyById(id);

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

                const policy = await policyService.createPolicy({
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
                const policy = await policyService.getPolicyById(id);
                if (!policy) {
                    return sendResponse(res, false, 'Policy not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.PdfPath = `/uploads/policies/${req.file.filename}`;
                }

                const updatedPolicy = await policyService.updatePolicy(policy, updateData);
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
        const policy = await policyService.getPolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        await policyService.deletePolicy(policy);
        sendResponse(res, true, 'Policy deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete policy', null, { message: error.message });
    }
};
