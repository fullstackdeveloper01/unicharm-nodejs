const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TypeMaster = sequelize.define('TypeMaster', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TypeName: {
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
  tableName: 'TypeMasters',
  timestamps: false
});

module.exports = TypeMaster;
