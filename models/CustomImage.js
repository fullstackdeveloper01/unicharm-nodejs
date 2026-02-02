const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomImage = sequelize.define('CustomImage', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ShowType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ImageName: {
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
  tableName: 'CustomImage',
  timestamps: false
});

module.exports = CustomImage;
