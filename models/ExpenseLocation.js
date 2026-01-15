const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpenseLocation = sequelize.define('ExpenseLocation', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  LocationName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UnitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Units',
      key: 'Id'
    }
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
  tableName: 'ExpenseLocations',
  timestamps: false
});

module.exports = ExpenseLocation;
