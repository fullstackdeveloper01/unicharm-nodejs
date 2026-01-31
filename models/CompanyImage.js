const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyImage = sequelize.define('CompanyImages', {
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
  Type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ShowType: {
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
  tableName: 'CompanyImages',
  timestamps: false
});

module.exports = CompanyImage;
