const { Department } = require('../../models/superAdmin');

/**
 * Get department by ID
 * @param {number} id 
 * @returns {Promise<Object>}
 */
const getDepartmentById = async (id) => {
    try {
        const department = await Department.findByPk(id);
        return department;
    } catch (error) {
        console.error('Error in getDepartmentById:', error);
        throw error;
    }
};

/**
 * Get all departments
 * @returns {Promise<Array>}
 */
const getAllDepartments = async () => {
    try {
        const departments = await Department.findAll({
            where: { IsDeleted: false }
        });
        return departments;
    } catch (error) {
        console.error('Error in getAllDepartments:', error);
        throw error;
    }
};

module.exports = {
    getDepartmentById,
    getAllDepartments
};
