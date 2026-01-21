const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginDetail = sequelize.define('LoginDetail', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Designation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UserType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LoginTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'LoginDetails',
    timestamps: false
});

module.exports = LoginDetail;
