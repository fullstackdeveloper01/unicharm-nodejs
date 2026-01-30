const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Designation = sequelize.define('Designation', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  DesignationName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  DepartmentId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'Departments',
      key: 'Id'
    }
  },
  CreatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Designation',
  timestamps: false
});

module.exports = Designation;
