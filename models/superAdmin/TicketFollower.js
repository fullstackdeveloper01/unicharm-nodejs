const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TicketFollower = sequelize.define('TicketFollower', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    TicketId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    FollowerId: {
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
    CreatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ticketfollower',
    timestamps: false
});

module.exports = TicketFollower;
