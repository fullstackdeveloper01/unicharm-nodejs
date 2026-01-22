const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingNotification = sequelize.define('MeetingNotification', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  MobileNo1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  MobileNo2: {
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
  tableName: 'MeetingNotification',
  timestamps: false
});

module.exports = MeetingNotification;
