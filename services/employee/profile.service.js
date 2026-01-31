const db = require('../../models');
const { Employee, Department, Designation } = db;

/**
 * Get employee profile details
 * @param {number} userId - Employee Database ID
 */
exports.getProfile = async (userId) => {
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
exports.updateProfile = async (userId, data) => {
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
exports.changePassword = async (userId, oldPassword, newPassword) => {
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
