const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zone = sequelize.define('Zone', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ZoneName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UnitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Units',
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
  tableName: 'Zones',
  timestamps: false
});

module.exports = Zone;
