const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TicketReply = sequelize.define('TicketReply', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TicketId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Tickets',
      key: 'Id'
    }
  },
  ReplyText: {
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
  tableName: 'TicketReplies',
  timestamps: false
});

module.exports = TicketReply;
