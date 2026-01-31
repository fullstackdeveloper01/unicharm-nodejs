const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const WallLike = sequelize.define('WallLike', {
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
    CreatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'walllike',
    timestamps: false
});

module.exports = WallLike;
