const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Notice = sequelize.define('Notice', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Role: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Roles',
      key: 'Id'
    }
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Image: {
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
  tableName: 'notice',
  timestamps: false
});

module.exports = Notice;
