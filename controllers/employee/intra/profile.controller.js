

const multer = require('multer');
const path = require('path');
const fs = require('fs');


// --- Business Logic (Merged) ---

const { Employee, Department, Designation } = require('../../../models/superAdmin');


/**
 * Get employee profile details
 * @param {number} userId - Employee Database ID
 */
const getProfile = async (userId) => {
    const employee = await Employee.findByPk(userId, {
        include: [
            { model: Department, as: 'department', attributes: ['DepartmentName'] },
            { model: Designation, as: 'designation', attributes: ['DesignationName'] }
        ],
        attributes: [
            'Id', 'FirstName', 'LastName', 'Email',
            'MobileNo1', 'EmpId', 'UserPhoto', 'Birthdate'
        ]
    });

    if (!employee) throw new Error('Employee not found');

    let profileImage = employee.UserPhoto;
    if (profileImage && !profileImage.startsWith('http')) {
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

        // Check if it's a legacy path (Images/...) or new upload (uploads/...)
        // If it's just a filename, assume standard uploads/profile/ if it starts with profile-, else legacy
        if (!profileImage.startsWith('/') && !profileImage.includes('/')) {
            if (profileImage.startsWith('profile-')) {
                profileImage = `/uploads/profile/${profileImage}`;
            } else {
                profileImage = `/Images/Profile/${profileImage}`;
            }
        }
        // Ensure leading slash if missing
        if (!profileImage.startsWith('/') && !profileImage.startsWith('http')) {
            profileImage = `/${profileImage}`;
        }

        profileImage = `${baseUrl}${profileImage}`;
    }

    // Generate Initials
    const firstInitial = employee.FirstName ? employee.FirstName.charAt(0).toUpperCase() : '';
    const lastInitial = employee.LastName ? employee.LastName.charAt(0).toUpperCase() : '';
    const initials = `${firstInitial}${lastInitial}`;

    return {
        firstName: employee.FirstName,
        lastName: employee.LastName || '',
        email: employee.Email,
        phone: employee.MobileNo1,
        designation: employee.designation ? employee.designation.DesignationName : '',
        department: employee.department ? employee.department.DepartmentName : '',
        employeeId: employee.EmpId,
        profileImage: profileImage,
        initials: initials,
        dob: employee.Birthdate
    };
};

/**
 * Update employee profile
 * @param {number} userId 
 * @param {Object} data 
 */
const updateProfile = async (userId, data) => {
    const employee = await Employee.findByPk(userId);
    if (!employee) throw new Error('Employee not found');

    // Only allow updating specific fields
    const updateData = {};
    if (data.firstName) updateData.FirstName = data.firstName;
    if (data.lastName) updateData.LastName = data.lastName;
    if (data.phone) updateData.MobileNo1 = data.phone;
    if (data.profileImage) updateData.UserPhoto = data.profileImage;

    // If other fields need to be updated, add them here.
    // Email/EmpId usually not editable by employee.

    await employee.update(updateData);

    return { success: true, message: 'Profile updated successfully' };
};

/**
 * Change Password
 * @param {number} userId 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 */
const changePassword = async (userId, oldPassword, newPassword) => {
    const employee = await Employee.findByPk(userId);
    if (!employee) throw new Error('Employee not found');

    // Verify old password (plain text per legacy)
    if (employee.Password !== oldPassword) {
        throw new Error('Incorrect old password');
    }

    // Update to new password
    await employee.update({ Password: newPassword });

    return { success: true, message: 'Password changed successfully' };
};

// -----------------------------

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
        const data = await getProfile(userId);
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

        const result = await updateProfile(userId, updateData);
        const data = await getProfile(userId);
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

        const result = await changePassword(userId, oldPassword, newPassword);
        const data = await getProfile(userId);
        sendResponse(res, true, data, result.message);
    } catch (error) {
        sendResponse(res, false, null, error.message);
    }
};
