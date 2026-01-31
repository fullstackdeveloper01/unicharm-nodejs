const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Designation = sequelize.define('Designation', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DesignationName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  DepartmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departments',
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
  tableName: 'designation',
  timestamps: false
});

module.exports = Designation;
