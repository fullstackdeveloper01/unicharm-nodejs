const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Policy = sequelize.define('Policy', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description' // Map to SQL column 'description'
  },
  CategoryId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'Catagory' // Map to SQL column 'Catagory'
  },
  RoleId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'Role' // Map to SQL column 'Role'
  },
  Date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Image: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'Image' // Explicitly map to DB column 'Image'
  },
  PdfPath: { // Virtual field or alias for Image if used interchangeably in code
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('Image');
    },
    set(value) {
      this.setDataValue('Image', value);
    }
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
  tableName: 'policies',
  timestamps: false
});

module.exports = Policy;
