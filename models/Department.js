const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DepartmentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CreatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  CostCenter: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Departments',
  timestamps: false
});

module.exports = Department;
// Model updated with Category field
