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

exports.uploadMiddleware = upload.single('profileImage');

const sendResponse = (res, success, data = null, message = '') => {
    if (success) {
        res.status(200).json({ success: true, message, data });
    } else {
        res.status(400).json({ success: false, message: message || 'An error occurred' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await profileService.getProfile(userId);
        sendResponse(res, true, data, 'Profile fetched successfully');
    } catch (error) {
        sendResponse(res, false, null, error.message);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Prepare data from body and file
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profileImage = `/uploads/profile/${req.file.filename}`;
        }

        const result = await profileService.updateProfile(userId, updateData);
        const data = await profileService.getProfile(userId);
        sendResponse(res, true, data, result.message);
    } catch (error) {
        sendResponse(res, false, null, error.message);
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return sendResponse(res, false, null, 'Old and new passwords are required');
        }

        const result = await profileService.changePassword(userId, oldPassword, newPassword);
        const data = await profileService.getProfile(userId);
        sendResponse(res, true, data, result.message);
    } catch (error) {
        sendResponse(res, false, null, error.message);
    }
};
