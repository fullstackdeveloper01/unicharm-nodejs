const db = require('../models');
const { Department } = db;
const { Op } = require('sequelize');

/**
 * Get all departments
 * @returns {Promise<Array>} List of departments
 */
exports.getAllDepartments = async () => {
    return await Department.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });
};

/**
 * Get department by ID
 * @param {number} id - Department ID
 * @returns {Promise<Object>} Department
 */
exports.getDepartmentById = async (id) => {
    return await Department.findByPk(id);
};

/**
 * Create department
 * @param {Object} data - Department data
 * @returns {Promise<Object>} Created department
 */
exports.createDepartment = async (data) => {
    return await Department.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update department
 * @param {Object} department - Department instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated department
 */
exports.updateDepartment = async (department, data) => {
    return await department.update(data);
};

/**
 * Delete department (soft delete)
 * @param {Object} department - Department instance
 * @returns {Promise<Object>} Deleted department
 */
exports.deleteDepartment = async (department) => {
    return await department.update({ IsDeleted: true });
};

/**
 * Get departments for dropdown
 * @returns {Promise<Array>} Dropdown items
 */
exports.selectDepartments = async () => {
    const departments = await Department.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'DepartmentName']
    });
    return departments.map(dept => ({ value: dept.Id, text: dept.DepartmentName }));
};
