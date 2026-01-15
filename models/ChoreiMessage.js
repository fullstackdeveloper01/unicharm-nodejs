const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChoreiMessage = sequelize.define('ChoreiMessage', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Message: {
    type: DataTypes.TEXT,
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
  tableName: 'ChoreiMessages',
  timestamps: false
});

module.exports = ChoreiMessage;
