const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const City = sequelize.define('City', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  StateId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'city',
  timestamps: false
});

module.exports = City;
