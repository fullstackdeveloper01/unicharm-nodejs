const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChoreiMessage = sequelize.define('ChoreiMessage', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  PdfPath: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Role: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  AddedBy: {
    type: DataTypes.BIGINT,
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
  }
}, {
  tableName: 'ChoreiMessage',
  timestamps: false
});

module.exports = ChoreiMessage;
