const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Region = sequelize.define('Region', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IsDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'region',
    timestamps: false
});

module.exports = Region;
