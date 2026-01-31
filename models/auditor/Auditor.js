const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Auditor = sequelize.define('Auditors', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  MobileNo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Unit: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  Zone: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  Location: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
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
  ModifiedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserPhoto: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'auditors',
  timestamps: false
});

module.exports = Auditor;
