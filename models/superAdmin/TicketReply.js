const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TicketReply = sequelize.define('TicketReply', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  TicketId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  RepliedbyBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  ReplyType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Reply: {
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
  tableName: 'ticketreply',
  timestamps: false
});

module.exports = TicketReply;
