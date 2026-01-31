const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SalesPricePolicy = sequelize.define('SalesPricePolicy', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  DesignationRank: {
    type: DataTypes.STRING,
    allowNull: true
  },
  CompetencyRank: {
    type: DataTypes.STRING,
    allowNull: true
  },
  HqDaMetro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  HqDaNonMetro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ExHqDaMetro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ExHqDaNonMetro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UpcountryMetro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UpcountryNonMetro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  LodgingAndBoarding: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Active'
  },
  CreatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'salespricepolicy',
  timestamps: false
});

// Static methods for database operations
const { Op } = require('sequelize');

/**
 * Get all sales price policies with pagination and search
 * @param {number} page - Page number
 * @param {number} limit - Items per page (null for all)
 * @param {string} search - Search term
 * @returns {Promise<Object>} Result with rows and count
 */
SalesPricePolicy.getAllPolicies = async function (page = 1, limit = null, search = '') {
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
    whereClause[Op.or] = [
      { DesignationRank: { [Op.like]: `%${search}%` } },
      { CompetencyRank: { [Op.like]: `%${search}%` } },
      { Status: { [Op.like]: `%${search}%` } }
    ];
  }

  const queryOptions = {
    where: whereClause,
    order: [['CreatedOn', 'DESC']]
  };

  if (limitNumber) {
    queryOptions.limit = limitNumber;
    queryOptions.offset = (pageNumber - 1) * limitNumber;
  }

  return await SalesPricePolicy.findAndCountAll(queryOptions);
};

/**
 * Get sales price policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
SalesPricePolicy.getPolicyById = async function (id) {
  return await SalesPricePolicy.findByPk(id);
};

/**
 * Create new sales price policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
SalesPricePolicy.createPolicy = async function (data) {
  return await SalesPricePolicy.create({
    ...data,
    CreatedOn: new Date(),
    IsDeleted: false
  });
};

/**
 * Update sales price policy
 * @param {number} id - Policy ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
SalesPricePolicy.updatePolicy = async function (id, data) {
  const policy = await SalesPricePolicy.findByPk(id);
  if (!policy) {
    throw new Error('Policy not found');
  }
  return await policy.update(data);
};

/**
 * Delete sales price policy (soft delete)
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Deleted policy
 */
SalesPricePolicy.deletePolicy = async function (id) {
  const policy = await SalesPricePolicy.findByPk(id);
  if (!policy) {
    throw new Error('Policy not found');
  }
  return await policy.update({ IsDeleted: true });
};

module.exports = SalesPricePolicy;
