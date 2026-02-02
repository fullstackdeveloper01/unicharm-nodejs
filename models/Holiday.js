const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holiday = sequelize.define('Holiday', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  HolidayDate: {
    type: DataTypes.DATEONLY,
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
  tableName: 'Holiday',
  timestamps: false
});

module.exports = Holiday;
