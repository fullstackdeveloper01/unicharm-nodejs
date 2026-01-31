const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const WallLike = sequelize.define('WallLike', {
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
    CreatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'walllike',
    timestamps: false
});

module.exports = WallLike;
