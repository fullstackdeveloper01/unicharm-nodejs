const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuoteOfTheDay = sequelize.define('QuoteOfTheDay', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Quote: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Author: {
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
  tableName: 'QuoteOfTheDays',
  timestamps: false
});

module.exports = QuoteOfTheDay;
