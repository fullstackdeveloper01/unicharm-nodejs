const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingRequest = sequelize.define('MeetingRequest', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    RoomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'Room'
    },
    CreatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'CreatedOn'
    },
    IsDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'IsDeleted'
    },
    Purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'Purpose'
    },
    AproveStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        field: 'AproveStatus'
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'UserId'
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'Title'
    },
    StartTime: {
        type: DataTypes.STRING, // Using STRING for safety as data not shown, could be TIME/DATETIME
        allowNull: true,
        field: 'StartTime'
    },
    EndTime: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'EndTime'
    }
}, {
    tableName: 'MeetingDetails',
    timestamps: false
});

module.exports = MeetingRequest;
