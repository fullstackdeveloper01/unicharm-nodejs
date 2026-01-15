const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomImage = sequelize.define('CustomImage', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ImagePath: {
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
  tableName: 'CustomImages',
  timestamps: false
});

module.exports = CustomImage;
