const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
      model: 'Employees',
      key: 'Id'
    }
  },
  Unit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Zone: {
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
  tableName: 'Accountants',
  timestamps: false
});

module.exports = Accountant;
