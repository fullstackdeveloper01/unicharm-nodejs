const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WallComment = sequelize.define('WallComment', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    WallId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Wall',
            key: 'Id'
        }
    },
    EmployeeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Employees',
            key: 'Id'
        }
    },
    Comment: {
        type: DataTypes.TEXT,
        allowNull: false
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
    tableName: 'WallComment',
    timestamps: false
});

module.exports = WallComment;
