const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const WallComment = sequelize.define('WallComment', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    WallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'wall',
            key: 'Id'
        }
    },
    EmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employees',
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
    tableName: 'wallcomment',
    timestamps: false
});

module.exports = WallComment;
