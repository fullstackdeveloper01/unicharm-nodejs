const { Employee, Department, Designation, Role } = require('../../../models/superAdmin');

/**
 * Get employee profile by ID
 * @param {number} employeeId 
 * @returns {Promise<Object>}
 */
const getProfile = async (employeeId) => {
    try {
        const employee = await Employee.findByPk(employeeId, {
            include: [
                { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] },
                { model: Designation, as: 'designation', attributes: ['Id', 'DesignationName'] },
                { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
            ]
        });
        return employee;
    } catch (error) {
        console.error('Error in getProfile:', error);
        throw error;
    }
};

module.exports = {
    getProfile
};
