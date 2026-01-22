const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingRequest = sequelize.define('MeetingRequest', {
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
        field: 'Purpose' // Map to legacy column
    },
    RoomId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'Room' // Map to legacy column
    },
    BookedBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'UserId' // Map to legacy column
    },
    StartTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    EndTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        field: 'AproveStatus' // Map to legacy column
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
    tableName: 'MeetingDetails', // Correct table name
    timestamps: false
});

module.exports = MeetingRequest;
