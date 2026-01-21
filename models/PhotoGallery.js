const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhotoGallery = sequelize.define('PhotoGallery', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  MainImage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  AdditionalImages: {
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
  }
}, {
  tableName: 'PhotoGallery',
  timestamps: false
});

module.exports = PhotoGallery;
