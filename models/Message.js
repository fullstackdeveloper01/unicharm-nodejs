const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Quote: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  RoleId: {
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
  }
}, {
  tableName: 'Messages',
  timestamps: false
});

module.exports = Message;
