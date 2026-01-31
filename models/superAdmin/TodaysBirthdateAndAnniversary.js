const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TodaysBirthdateAndAnniversary = sequelize.define('TodaysBirthdateAndAnniversary', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    Type: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    BirthdateUsertId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    Birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    Comment: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    CommentUserId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    CreatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'todaysbirthdateandanniversary',
    timestamps: false
});

module.exports = TodaysBirthdateAndAnniversary;
