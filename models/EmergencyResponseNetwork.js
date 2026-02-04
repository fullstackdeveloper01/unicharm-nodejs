const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyResponseNetwork = sequelize.define('EmergencyResponseNetwork', {
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

    const result = await EmergencyResponseNetwork.findAndCountAll(queryOptions);

    // Prepend base URL to PDF paths
    const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
    const rows = result.rows.map(record => {
        const r = record.toJSON();
        if (r.PdfPath && !r.PdfPath.startsWith('http')) {
            const path = r.PdfPath.startsWith('/') ? r.PdfPath : `/${r.PdfPath}`;
            r.PdfPath = `${baseUrl}${path}`;
        }
        return r;
    });

    return { count: result.count, rows };
};

/**
 * Get emergency response record by ID
 * @param {number} id - Record ID
 * @returns {Promise<Object>} Record
 */
EmergencyResponseNetwork.getRecordById = async function (id) {
    const record = await EmergencyResponseNetwork.findByPk(id);

    if (record) {
        const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
        const r = record.toJSON();

        if (r.PdfPath && !r.PdfPath.startsWith('http')) {
            const path = r.PdfPath.startsWith('/') ? r.PdfPath : `/${r.PdfPath}`;
            r.PdfPath = `${baseUrl}${path}`;
        }

        return r;
    }

    return record;
};

/**
 * Create new emergency response record
 * @param {Object} data - Record data
 * @returns {Promise<Object>} Created record
 */
EmergencyResponseNetwork.createRecord = async function (data) {
    if (data.Title) {
        const existing = await EmergencyResponseNetwork.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Record with this title already exists');
        }
    }
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

    if (data.Title && data.Title !== record.Title) {
        const existing = await EmergencyResponseNetwork.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: id }
            }
        });
        if (existing) {
            throw new Error('Record with this title already exists');
        }
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
