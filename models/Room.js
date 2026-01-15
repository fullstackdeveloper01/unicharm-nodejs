const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RoomName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FloorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Floors',
      key: 'Id'
    }
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
  tableName: 'Rooms',
  timestamps: false
});

module.exports = Room;
