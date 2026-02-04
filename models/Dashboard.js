const { DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dashboard = sequelize.define('Dashboard', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'Dashboard_Virtual', // Virtual table, not real
    timestamps: false
});

/**
 * Get Recent News
 */
Dashboard.getRecentNews = async function () {
    const query = 'CALL USP_GetRecentNews(0)';
    const results = await sequelize.query(query, {
        type: QueryTypes.SELECT
    });
    const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
    let rows = Array.isArray(results) && results.length > 0 ? results[0] : results;
    if (Array.isArray(rows)) {
        rows = rows.map(r => {
            let imagePath = null;
            if (r.Image) {
                if (r.Image.startsWith('http')) {
                    imagePath = r.Image;
                } else {
                    const path = r.Image.startsWith('/') ? r.Image : `/${r.Image}`;
                    imagePath = `${baseUrl}${path}`;
                }
            }
            return { ...r, image: imagePath, ImagePath: imagePath, Image: imagePath };
        });
    }
    return rows;
};

/**
 * Get Recent Events
 */
Dashboard.getRecentEvent = async function () {
    const query = 'CALL USP_GetRecentEvent(0)';
    const results = await sequelize.query(query, {
        type: QueryTypes.SELECT
    });
    const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
    let rows = Array.isArray(results) && results.length > 0 ? results[0] : results;
    if (Array.isArray(rows)) {
        rows = rows.map(r => {
            let imagePath = null;
            if (r.Image) {
                if (r.Image.startsWith('http')) {
                    imagePath = r.Image;
                } else {
                    const path = r.Image.startsWith('/') ? r.Image : `/${r.Image}`;
                    imagePath = `${baseUrl}${path}`;
                }
            }
            return { ...r, image: imagePath, ImagePath: imagePath, Image: imagePath };
        });
    }
    return rows;
};

/**
 * Get Recent Policies
 */
Dashboard.getRecentPolicies = async function () {
    const query = 'CALL USP_GetRecentPolicies(0)';
    const results = await sequelize.query(query, {
        type: QueryTypes.SELECT
    });
    return Array.isArray(results) && results.length > 0 ? results[0] : results;
};

/**
 * Get Work Anniversaries
 */
Dashboard.getWorkAnniversary = async function () {
    const query = 'CALL USP_GetWorkAnniversary(0)';
    const results = await sequelize.query(query, {
        type: QueryTypes.SELECT
    });
    return Array.isArray(results) && results.length > 0 ? results[0] : results;
};

module.exports = Dashboard;
