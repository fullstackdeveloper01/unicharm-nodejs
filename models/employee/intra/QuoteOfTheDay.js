const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const QuoteOfTheDay = sequelize.define('QuoteOfTheDay', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Quote: {
    type: DataTypes.STRING,
    allowNull: true
  },
  AddedBy: {
    type: DataTypes.BIGINT,
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
  tableName: 'quoteoftheday',
  timestamps: false
});

module.exports = QuoteOfTheDay;
