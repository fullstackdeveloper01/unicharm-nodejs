const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CurrencyMaster = sequelize.define('CurrencyMaster', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  INRValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  ConvertedValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  tableName: 'cuurencymaster',
  timestamps: false
});

module.exports = CurrencyMaster;
