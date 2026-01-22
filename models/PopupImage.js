const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PopupImage = sequelize.define('PopupImage', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    PopupType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ShowType: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'PopupImage',
    timestamps: false
});

module.exports = PopupImage;
