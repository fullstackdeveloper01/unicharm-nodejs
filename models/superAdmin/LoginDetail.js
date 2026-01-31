const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const LoginDetail = sequelize.define('LoginDetail', {
    LoginId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    UserId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    LoginUserType: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    LoginDatetime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    LogoutDatetime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    IsDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    MACAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IPAddress: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'logindetail',
    timestamps: false
});

module.exports = LoginDetail;
