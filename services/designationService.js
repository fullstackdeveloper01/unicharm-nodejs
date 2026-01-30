const db = require('../models');
const { Designation, Department } = db;
const { Op } = require('sequelize');

/**
 * Get all designations
 * @returns {Promise<Array>} List of designations
 */
exports.getAllDesignations = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        include: [
            { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Designation.findAndCountAll(queryOptions);
};

/**
 * Get designation by ID
 * @param {number} id - Designation ID
 * @returns {Promise<Object>} Designation
 */
exports.getDesignationById = async (id) => {
    return await Designation.findByPk(id, {
        include: [{ model: Department, as: 'department' }]
    });
};

/**
 * Create designation
 * @param {Object} data - Designation data
 * @returns {Promise<Object>} Created designation
 */
exports.createDesignation = async (data) => {
    return await Designation.create({
        ...data,
        DepartmentId: data.DepartmentId || null,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update designation
 * @param {Object} designation - Designation instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated designation
 */
exports.updateDesignation = async (designation, data) => {
    return await designation.update(data);
};

/**
 * Delete designation (soft delete)
 * @param {Object} designation - Designation instance
 * @returns {Promise<Object>} Deleted designation
 */
exports.deleteDesignation = async (designation) => {
    return await designation.update({ IsDeleted: true });
};

/**
 * Get designations for dropdown
 * @returns {Promise<Array>} Dropdown items
 */
exports.selectDesignations = async () => {
    const designations = await Designation.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'DesignationName']
    });
    return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};

/**
 * Get expense designations for dropdown
 * @returns {Promise<Array>} Dropdown items
 */
exports.selectExpenseDesignations = async () => {
    // Currently same logic as selectDesignations based on original controller
    const designations = await Designation.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'DesignationName']
    });
    return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};
