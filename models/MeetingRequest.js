const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingRequest = sequelize.define('MeetingDetails', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    LocationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'Location'
    },
    FloorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'Floor'
    },
    RoomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'Room'
    },
    Purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'Purpose'
    },
    Date: {
        type: DataTypes.STRING, // Schema says 'text', usually YYYY-MM-DD
        allowNull: true,
        field: 'Date'
    },
    TimeFrom: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: 'TimeFrom'
    },
    TimeTo: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: 'TimeTo'
    },
    Status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        field: 'AproveStatus'
    },
    ApprovedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'AprovedBy'
    },
    ApproveComment: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'AproveComment'
    },
    ApproveTime: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'AproveTime'
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'UserId'
    },
    CreatedOn: {
        type: DataTypes.STRING, // Schema says 'text' like '2020-12-25 08:46:45'
        defaultValue: DataTypes.NOW, // Sequelize will try to put date object, might need hook or just let it stringify
        field: 'CreatedOn'
    },
    IsDeleted: {
        type: DataTypes.STRING, // Schema says text? 'IsDeleted text'. Wait, usually boolean.
        // Sample data shows empty strings.
        // Let's assume 'true'/'false' or '1'/'0' string. Or just boolean if sequelize handles it.
        // Input schema says "IsDeleted text".
        // I will match it as STRING but handle it as boolean logic.
        defaultValue: 'false',
        field: 'IsDeleted'
    }
}, {
    tableName: 'meetingdetails', // Lowercase as per schema? Or MeetingDetails? Sample says 'meetingdetails'.
    // User schema header: "Table: meetingdetails"
    timestamps: false
});

module.exports = MeetingRequest;
