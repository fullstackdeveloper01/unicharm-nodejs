const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PhotoGallery = sequelize.define('PhotoGallery', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // AdditionalImages column removed as per user feedback/DB schema
  // MainImage mapped to Image by correcting the field name
  CreatedOn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'photogallery',
  timestamps: false
});

module.exports = PhotoGallery;
