const profileService = require('../../services/employee/profile.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/profile/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Wrapped middleware to catch Multer errors
exports.uploadMiddleware = (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            console.error('Multer Upload Error:', err);
            return res.status(500).json({ success: false, message: 'File upload failed: ' + err.message });
        }
        next();
    });
};

const sendResponse = (res, success, message, data = null, statusCode = 200) => {
    if (success) {
        res.status(statusCode).json({ success: true, message, data });
    } else {
        res.status(statusCode === 200 ? 400 : statusCode).json({ success: false, message: message || 'An error occurred', data: null });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, false, 'User not authenticated', null, 401);
        }
        const userId = req.user.id;
        const data = await profileService.getProfile(userId);
        sendResponse(res, true, 'Profile fetched successfully', data);
    } catch (error) {
        console.error('GetProfile Error:', error);
        sendResponse(res, false, error.message, null, 500);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, false, 'User not authenticated', null, 401);
        }
        const userId = req.user.id;

        console.log('Updating profile for user:', userId);
        console.log('Body:', req.body);

        // Prepare data from body and file
        const updateData = { ...req.body };
        if (req.file) {
            console.log('File uploaded:', req.file.filename);
            updateData.profileImage = `/uploads/profile/${req.file.filename}`;
        }

        const result = await profileService.updateProfile(userId, updateData);
        // Fetch updated profile to return
        const data = await profileService.getProfile(userId);

        sendResponse(res, true, result.message, data);
    } catch (error) {
        console.error('UpdateProfile Error:', error);
        sendResponse(res, false, 'Update failed: ' + error.message, null, 500);
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return sendResponse(res, false, 'Old and new passwords are required');
        }

        const result = await profileService.changePassword(userId, oldPassword, newPassword);
        sendResponse(res, true, result.message);
    } catch (error) {
        sendResponse(res, false, error.message);
    }
};
