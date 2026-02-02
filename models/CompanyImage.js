const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyImage = sequelize.define('CompanyImage', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  CreatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ImagePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ImageName: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'CompanyImages',
  timestamps: false
});

module.exports = CompanyImage;
