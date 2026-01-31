const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TicketFeedback = sequelize.define('TicketFeedback', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    TicketId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    FeedBackBy: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    Feedback: {
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
    },
    Star1: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Star2: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Star3: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Star4: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Star5: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'ticketfeedback',
    timestamps: false
});

module.exports = TicketFeedback;
