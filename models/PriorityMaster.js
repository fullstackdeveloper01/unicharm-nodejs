const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PriorityMaster = sequelize.define('PriorityMaster', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PriorityName: {
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
  tableName: 'PriorityMasters',
  timestamps: false
});

module.exports = PriorityMaster;
