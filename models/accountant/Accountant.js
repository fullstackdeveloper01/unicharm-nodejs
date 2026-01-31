const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Accountant = sequelize.define('Accountant', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  EmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'Id'
    }
  },
  EmpId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Password: {
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
  },
  ModifiedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'accountant',
  timestamps: false
});

module.exports = Accountant;
