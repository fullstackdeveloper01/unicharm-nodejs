const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Event = sequelize.define('Events', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  EventDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'Date'
  },
  Image: {
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
  tableName: 'events',
  timestamps: false
});

module.exports = Event;
