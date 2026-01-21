const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  HqDaNonMetro: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  ExHqDaMetro: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  ExHqDaNonMetro: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  UpcountryMetro: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  UpcountryNonMetro: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: 'SalesPricePolicy',
  timestamps: false
});

module.exports = SalesPricePolicy;
