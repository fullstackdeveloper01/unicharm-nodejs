const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CurrencyMaster = sequelize.define('CurrencyMaster', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CurrencyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  CurrencySymbol: {
    type: DataTypes.STRING,
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
  tableName: 'CurrencyMasters',
  timestamps: false
});

module.exports = CurrencyMaster;
