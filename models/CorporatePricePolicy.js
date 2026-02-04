const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CorporatePricePolicy = sequelize.define('CorporatePricePolicy', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    entertainment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vehicle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lodging_metro: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lodging_non_metro: {
        type: DataTypes.STRING,
        allowNull: true
    },
    travel_mode: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    travel_own: {
        type: DataTypes.STRING,
        allowNull: true
    },
    other: {
        type: DataTypes.STRING,
        allowNull: true
    },
    business_promo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rnd: {
        type: DataTypes.STRING,
        allowNull: true
    },
    csr: {
        type: DataTypes.STRING,
        allowNull: true
    },
    actions: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Active'
    },
    created_on: {
        type: DataTypes.DATE, // Using DATE to match datetime
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    tableName: 'corporate_price_policy',
    timestamps: false
});

// Static methods for database operations
const { Op } = require('sequelize');

/**
 * Get all corporate price policies with pagination and search
 * @param {number} page - Page number
 * @param {number} limit - Items per page (null for all)
 * @param {string} search - Search term
 * @returns {Promise<Object>} Result with rows and count
 */
CorporatePricePolicy.getAllPolicies = async function (page = 1, limit = null, search = '') {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { is_deleted: false },
            { is_deleted: null },
            { is_deleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = [
            {
                [Op.or]: [
                    { designation: { [Op.like]: `%${search}%` } }
                ]
            }
        ];
    }

    const queryOptions = {
        where: whereClause,
        order: [['created_on', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await CorporatePricePolicy.findAndCountAll(queryOptions);
};

/**
 * Get corporate price policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
CorporatePricePolicy.getPolicyById = async function (id) {
    return await CorporatePricePolicy.findByPk(id);
};

/**
 * Create new corporate price policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
CorporatePricePolicy.createPolicy = async function (data) {
    if (data.designation) {
        const existing = await CorporatePricePolicy.findOne({
            where: {
                designation: data.designation,
                is_deleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Policy for this designation already exists');
        }
    }
    return await CorporatePricePolicy.create({
        ...data,
        created_on: new Date(),
        is_deleted: false
    });
};

/**
 * Update corporate price policy
 * @param {number} id - Policy ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
CorporatePricePolicy.updatePolicy = async function (id, data) {
    const policy = await CorporatePricePolicy.findByPk(id);
    if (!policy) {
        throw new Error('Policy not found');
    }

    if (data.designation && data.designation !== policy.designation) {
        const existing = await CorporatePricePolicy.findOne({
            where: {
                designation: data.designation,
                is_deleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: id }
            }
        });
        if (existing) {
            throw new Error('Policy for this designation already exists');
        }
    }
    return await policy.update(data);
};

/**
 * Delete corporate price policy (soft delete)
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Deleted policy
 */
CorporatePricePolicy.deletePolicy = async function (id) {
    const policy = await CorporatePricePolicy.findByPk(id);
    if (!policy) {
        throw new Error('Policy not found');
    }
    return await policy.update({ is_deleted: true });
};

module.exports = CorporatePricePolicy;
