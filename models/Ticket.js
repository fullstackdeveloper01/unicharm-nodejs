const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Requester: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Region: {
    type: DataTypes.STRING,
    allowNull: true
  },
  City: {
    type: DataTypes.STRING,
    allowNull: true
  },
  TypeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  TagId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  PreorityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Status: {
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
  IsManagerNotified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  MobileNo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IsClosed: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  tableName: 'Ticket',
  timestamps: false
});

module.exports = Ticket;
