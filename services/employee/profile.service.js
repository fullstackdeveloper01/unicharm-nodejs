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
        ]
        // No attributes filter - fetch all columns
    });

    if (!employee) throw new Error('Employee not found');

    let profileImage = employee.UserPhoto;
    if (profileImage && !profileImage.startsWith('http')) {
        const localBaseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
        const liveBaseUrl = process.env.LIVE_BASE_URL || 'http://103.39.133.42';

        // Check if it's a legacy path (Images/...) or new upload (uploads/...)
        // If it's just a filename, assume standard uploads/profile/ if it starts with profile-, else legacy
        if (!profileImage.startsWith('/') && !profileImage.includes('/')) {
            if (profileImage.startsWith('profile-')) {
                // New uploads - use local/current server
                profileImage = `${localBaseUrl}/uploads/profile/${profileImage}`;
            } else {
                // Legacy images - use live database server
                profileImage = `${liveBaseUrl}/Images/Profile/${profileImage}`;
            }
        } else {
            // Has path already - determine which base URL to use
            if (profileImage.includes('/Images/')) {
                profileImage = `${liveBaseUrl}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`;
            } else {
                profileImage = `${localBaseUrl}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`;
            }
        }
    }

    // Generate Initials
    const firstInitial = employee.FirstName ? employee.FirstName.charAt(0).toUpperCase() : '';
    const lastInitial = employee.LastName ? employee.LastName.charAt(0).toUpperCase() : '';
    const initials = `${firstInitial}${lastInitial}`;

    // Return all employee data with friendly names
    return {
        id: employee.Id,
        firstName: employee.FirstName,
        lastName: employee.LastName || '',
        email: employee.Email,
        phone: employee.MobileNo1,
        mobileNo: employee.MobileNo1,
        mobileNo2: employee.MobileNo2,
        designation: employee.designation ? employee.designation.DesignationName : '',
        department: employee.department ? employee.department.DepartmentName : '',
        designationId: employee.DesignationId,
        departmentId: employee.DepartmentId,
        roleId: employee.RoleId,
        employeeId: employee.EmpId,
        profileImage: profileImage,
        initials: initials,
        dob: employee.Birthdate,
        joiningDate: employee.Joiningdate,
        userName: employee.UserName,
        category: employee.Category,
        unit: employee.Unit,
        zone: employee.Zone,
        location: employee.Location,
        state: employee.State,
        city: employee.City,
        supervisor: employee.Supervisor,
        supervisorEmpId: employee.SupervisorEmpId,
        bankAccountNo: employee.BankAccountNo,
        bankName: employee.BankName,
        ifscCode: employee.IfscCode,
        expenseDepartment: employee.ExpenseDepartment,
        userType: employee.UserType,
        ttmt: employee.TTMT,
        secretaryId: employee.SecretaryId,
        createdOn: employee.CreatedOn
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

    console.log('updateProfile received data:', JSON.stringify(data));

    // Only allow updating specific fields
    // Map incoming data to database columns
    const updateData = {};

    // Handle FirstName variations
    const firstName = data.firstName || data.FirstName || data.first_name || data.name;
    if (firstName) updateData.FirstName = firstName;

    // Handle LastName variations
    const lastName = data.lastName || data.LastName || data.last_name;
    if (lastName !== undefined) updateData.LastName = lastName;

    // Handle phone number variations
    if (data.phone) updateData.MobileNo1 = data.phone;
    else if (data.mobileNo1) updateData.MobileNo1 = data.mobileNo1;
    else if (data.contactNumber) updateData.MobileNo1 = data.contactNumber;
    else if (data.MobileNo1) updateData.MobileNo1 = data.MobileNo1;

    // Handle Email update if provided
    if (data.email || data.Email) updateData.Email = data.email || data.Email;

    // Handle Profile Image
    if (data.profileImage) updateData.UserPhoto = data.profileImage;

    // Handle Department and Designation if provided (must be numeric IDs)
    const deptId = data.departmentId || data.DepartmentId;
    if (deptId && !isNaN(parseInt(deptId))) {
        updateData.DepartmentId = parseInt(deptId);
    }

    const desigId = data.designationId || data.DesignationId;
    if (desigId && !isNaN(parseInt(desigId))) {
        updateData.DesignationId = parseInt(desigId);
    }

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
