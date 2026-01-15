const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingNotification = sequelize.define('MeetingNotification', {
  Id: {
    type: DataTypes.INTEGER,
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
  MeetingDate: {
    type: DataTypes.DATE,
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
  tableName: 'MeetingNotifications',
  timestamps: false
});

module.exports = MeetingNotification;
