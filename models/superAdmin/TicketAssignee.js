const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TicketAssignee = sequelize.define('TicketAssignee', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    TicketId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    AssigneeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    GroupName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    CreatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ticketassignee',
    timestamps: false
});

module.exports = TicketAssignee;
