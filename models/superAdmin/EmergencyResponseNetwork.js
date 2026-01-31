const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmergencyResponseNetwork = sequelize.define('emergencyResponseNetwork', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    FileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PdfPath: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    IsDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'emergencyresponsenetwork',
    timestamps: false
});

// Static methods for database operations
const { Op } = require('sequelize');

/**
 * Get all emergency response records with pagination and search
 * @param {number} page - Page number
 * @param {number} limit - Items per page (null for all)
 * @param {string} search - Search term
 * @returns {Promise<Object>} Result with rows and count
 */
EmergencyResponseNetwork.getAllRecords = async function (page = 1, limit = null, search = '') {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = [
            {
                [Op.or]: [
                    { Title: { [Op.like]: `%${search}%` } },
                    { FileName: { [Op.like]: `%${search}%` } }
                ]
            }
        ];
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
EmergencyResponseNetwork.getRecordById = async function (id) {
    return await EmergencyResponseNetwork.findByPk(id);
};

/**
 * Create new emergency response record
 * @param {Object} data - Record data
 * @returns {Promise<Object>} Created record
 */
EmergencyResponseNetwork.createRecord = async function (data) {
    return await EmergencyResponseNetwork.create({
        ...data,
        CreatedAt: new Date(),
        IsDeleted: false
    });
};

/**
 * Update emergency response record
 * @param {number} id - Record ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated record
 */
EmergencyResponseNetwork.updateRecord = async function (id, data) {
    const record = await EmergencyResponseNetwork.findByPk(id);
    if (!record) {
        throw new Error('Record not found');
    }
    return await record.update(data);
};

/**
 * Delete emergency response record (soft delete)
 * @param {number} id - Record ID
 * @returns {Promise<Object>} Deleted record
 */
EmergencyResponseNetwork.deleteRecord = async function (id) {
    const record = await EmergencyResponseNetwork.findByPk(id);
    if (!record) {
        throw new Error('Record not found');
    }
    return await record.update({ IsDeleted: true });
};

module.exports = EmergencyResponseNetwork;
