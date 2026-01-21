const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  RoomName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Location: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  FloorId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'Floor' // Map to legacy column 'Floor'
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
  tableName: 'Room',
  timestamps: false
});

module.exports = Room;
