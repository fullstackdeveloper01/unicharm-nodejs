const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const ExpenseLocation = sequelize.define('ExpenseLocation', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ZoneId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UnitId: {
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
  },
  ModifiedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'expenselocation',
  timestamps: false
});

module.exports = ExpenseLocation;
