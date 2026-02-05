const emergencyResponseService = require('../../services/superadmin/emergencyResponseService');
const { validationResult } = require('express-validator'); // Kept if used elsewhere, but mainly manual validation now
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/ern/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-random-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'ern-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, statusCode, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message };
    if (data !== null) response.data = data;
    if (errors !== null) response.errors = errors;
    if (pagination) response.pagination = pagination;
    res.status(statusCode).json(response);
};

/**
 * Get all emergency response records
 * GET /api/emergency-response
 */
exports.getAllRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await emergencyResponseService.getAllRecords(page, limit, search);

        // Prepend base URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const rows = result.rows.map(record => {
            const r = record.toJSON ? record.toJSON() : record;
            if (r.PdfPath && !r.PdfPath.startsWith('http')) {
                const path = r.PdfPath.startsWith('/') ? r.PdfPath : `/${r.PdfPath}`;
                r.PdfPath = `${baseUrl}${path}`;
            }
            return r;
        });

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false,
            hasPrev: page > 1
        };

        sendResponse(res, 200, true, 'Emergency response records retrieved successfully', rows, null, pagination);
    } catch (error) {
        console.error('Error in getAllRecords:', error);
        sendResponse(res, 500, false, 'Failed to retrieve emergency response records', null, { message: error.message });
    }
};

/**
 * Get emergency response record by ID
 * GET /api/emergency-response/:id
 */
exports.getRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return sendResponse(res, 400, false, 'Invalid record ID', null, { message: 'Record ID must be a valid number' });
        }

        const record = await emergencyResponseService.getRecordById(id);

        if (!record) {
            return sendResponse(res, 404, false, 'Emergency response record not found');
        }

        const data = record; // record is already plain JSON from service
        if (data.PdfPath && !data.PdfPath.startsWith('http')) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const path = data.PdfPath.startsWith('/') ? data.PdfPath : `/${data.PdfPath}`;
            data.PdfPath = `${baseUrl}${path}`;
        }

        sendResponse(res, 200, true, 'Emergency response record retrieved successfully', data);
    } catch (error) {
        console.error('Error in getRecordById:', error);
        sendResponse(res, 500, false, 'Failed to retrieve emergency response record', null, { message: error.message });
    }
};

/**
 * Create new emergency response record
 * POST /api/emergency-response
 */
exports.createRecord = async (req, res) => {
    // Use any() to allow flexibility in file field name
    const uploadMiddleware = upload.any();

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return sendResponse(res, 400, false, 'File upload failed', null, { message: err.message });
        }

        try {
            // Flexible field access (handle case sensitivity and potential frontend mappings)
            const title = req.body.Title || req.body.title || req.body.ernTitle || req.body.ern_title;
            const fileNameInput = req.body.FileName || req.body.fileName || req.body.file_name;

            let fileName = fileNameInput;
            let pdfPath = null;

            // Get first uploaded file (handles unexpected field names)
            const uploadedFile = (req.files && req.files.length > 0) ? req.files[0] : null;

            if (uploadedFile) {
                // If FileName not provided, use original name
                if (!fileName) fileName = uploadedFile.originalname;

                pdfPath = `/uploads/ern/${uploadedFile.filename}`;
            }

            // Basic validation
            if (!title) {
                return sendResponse(res, 400, false, 'Validation failed', null, { message: 'Title is required' });
            }

            const record = await emergencyResponseService.createRecord({
                Title: title,
                FileName: fileName,
                PdfPath: pdfPath
            });

            sendResponse(res, 201, true, 'Emergency response record created successfully', record);
        } catch (error) {
            console.error('Error in createRecord:', error);
            sendResponse(res, 500, false, 'Failed to create emergency response record', null, { message: error.message });
        }
    });
};

/**
 * Update emergency response record
 * PUT /api/emergency-response/:id
 */
exports.updateRecord = async (req, res) => {
    const uploadMiddleware = upload.any();

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return sendResponse(res, 400, false, 'File upload failed', null, { message: err.message });
        }

        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return sendResponse(res, 400, false, 'Invalid record ID', null, { message: 'Record ID must be a valid number' });
            }

            const record = await emergencyResponseService.getRecordById(id);
            if (!record) {
                return sendResponse(res, 404, false, 'Emergency response record not found');
            }

            // Flexible field access for update
            const title = req.body.Title || req.body.title || req.body.ernTitle || req.body.ern_title;
            const fileNameInput = req.body.FileName || req.body.fileName || req.body.file_name;

            const updateData = {};
            if (title) updateData.Title = title;
            if (fileNameInput) updateData.FileName = fileNameInput; // Explicit update if provided

            // Check file
            const uploadedFile = (req.files && req.files.length > 0) ? req.files[0] : null;

            if (uploadedFile) {
                updateData.PdfPath = `/uploads/ern/${uploadedFile.filename}`;
                // Update FileName if not explicitly provided
                if (!fileNameInput) {
                    updateData.FileName = uploadedFile.originalname;
                }
            }

            const updatedRecord = await emergencyResponseService.updateRecord(id, updateData);
            sendResponse(res, 200, true, 'Emergency response record updated successfully', updatedRecord);
        } catch (error) {
            console.error('Error in updateRecord:', error);
            if (error.message === 'Record not found') {
                return sendResponse(res, 404, false, 'Emergency response record not found');
            }
            sendResponse(res, 500, false, 'Failed to update emergency response record', null, { message: error.message });
        }
    });
};

/**
 * Delete emergency response record (soft delete)
 * DELETE /api/emergency-response/:id
 */
exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return sendResponse(res, 400, false, 'Invalid record ID', null, { message: 'Record ID must be a valid number' });
        }

        await emergencyResponseService.deleteRecord(id);
        sendResponse(res, 200, true, 'Emergency response record deleted successfully');
    } catch (error) {
        console.error('Error in deleteRecord:', error);
        if (error.message === 'Record not found') {
            return sendResponse(res, 404, false, 'Emergency response record not found');
        }
        sendResponse(res, 500, false, 'Failed to delete emergency response record', null, { message: error.message });
    }
};
