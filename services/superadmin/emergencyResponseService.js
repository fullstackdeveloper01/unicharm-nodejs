const db = require('../../models');
const { EmergencyResponseNetwork } = db;

/**
 * Get all emergency response records
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search term
 * @returns {Promise<Object>} List of records
 */
exports.getAllRecords = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const { Op } = require('sequelize');

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({
            [Op.or]: [
                { Title: { [Op.like]: `%${search}%` } },
                { FileName: { [Op.like]: `%${search}%` } }
            ]
        });
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedAt', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await EmergencyResponseNetwork.findAndCountAll(queryOptions);
};

/**
 * Get emergency response record by ID
 * @param {number} id - Record ID
 * @returns {Promise<Object>} Record
 */
exports.getRecordById = async (id) => {
    return await EmergencyResponseNetwork.getRecordById(id);
};

/**
 * Create emergency response record
 * @param {Object} data - Record data
 * @returns {Promise<Object>} Created record
 */
exports.createRecord = async (data) => {
    return await EmergencyResponseNetwork.createRecord(data);
};

/**
 * Update emergency response record
 * @param {number} id - Record ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated record
 */
exports.updateRecord = async (id, data) => {
    return await EmergencyResponseNetwork.updateRecord(id, data);
};

/**
 * Delete emergency response record (soft delete)
 * @param {number} id - Record ID
 * @returns {Promise<Object>} Deleted record
 */
exports.deleteRecord = async (id) => {
    return await EmergencyResponseNetwork.deleteRecord(id);
};
