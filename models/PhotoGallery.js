const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhotoGallery = sequelize.define('PhotoGallery', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
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
  },
  MainImage: {
    type: DataTypes.STRING, // Or TEXT if paths are long
    allowNull: true
  },
  AdditionalImages: {
    type: DataTypes.TEXT, // Likely JSON or long string
    allowNull: true
  }
}, {
  tableName: 'PhotoGallery',
  timestamps: false
});

module.exports = PhotoGallery;
