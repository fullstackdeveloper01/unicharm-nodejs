const bulkImportService = require('../../services/superadmin/bulkImportService');
const multer = require('multer');

// Configure multer for memory storage (we process buffer directly)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv', // .csv
            'application/csv', // .csv
            'text/excel'
        ];

        if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Please upload only Excel (.xlsx, .xls) or CSV files'), false);
        }
    }
});

// Middleware for file upload
exports.uploadMiddleware = upload.single('file'); // 'file' matches the frontend form data field name

exports.bulkUpdateEmployees = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        console.log('Processing bulk update file:', req.file.originalname);

        const results = await bulkImportService.processBulkUpdate(req.file.buffer);

        res.json({
            success: true,
            message: 'Bulk update processing completed',
            data: results
        });

    } catch (error) {
        console.error('Bulk Update Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk update',
            error: error.message
        });
    }
};
