const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        defaultValue: DataTypes.NOW,
        field: 'CreatedOn'
    },
    IsDeleted: {
        type: DataTypes.STRING,
        defaultValue: 'false',
        field: 'IsDeleted'
    }
}, {
    tableName: 'meetingdetails',
    timestamps: false
});

module.exports = MeetingRequest;
