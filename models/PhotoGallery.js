const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhotoGallery = sequelize.define('PhotoGallery', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ImagePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Title: {
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
  tableName: 'PhotoGalleries',
  timestamps: false
});

module.exports = PhotoGallery;
