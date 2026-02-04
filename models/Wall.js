const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wall = sequelize.define('Wall', {
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
  },
  AddedBy: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'Employees',
      key: 'Id'
    }
  }
}, {
  tableName: 'Wall',
  timestamps: false
});

module.exports = Wall;
