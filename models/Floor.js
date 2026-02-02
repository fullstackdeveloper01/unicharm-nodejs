const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Floor = sequelize.define('Floor', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  FloorName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  LocationId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'Location' // Map to legacy column 'Location'
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
  tableName: 'Floor',
  timestamps: false
});

module.exports = Floor;
