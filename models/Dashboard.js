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
            // Check various possible image field names
            const imageField = r.Image || r.image || r.ImagePath || r.imagePath;

            if (imageField && imageField.trim() !== '') {
                if (imageField.startsWith('http')) {
                    imagePath = imageField;
                } else {
                    const path = imageField.startsWith('/') ? imageField : `/${imageField}`;
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
            // Check various possible image field names
            const imageField = r.Image || r.image || r.ImagePath || r.imagePath;

            if (imageField && imageField.trim() !== '') {
                if (imageField.startsWith('http')) {
                    imagePath = imageField;
                } else {
                    const path = imageField.startsWith('/') ? imageField : `/${imageField}`;
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

    const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
    let rows = Array.isArray(results) && results.length > 0 ? results[0] : results;

    if (Array.isArray(rows)) {
        rows = rows.map(emp => {
            // Check various possible photo field names
            const photoField = emp.UserPhoto || emp.userPhoto || emp.Photo || emp.photo;

            if (photoField && photoField.trim() !== '' && !photoField.startsWith('http')) {
                const path = photoField.startsWith('/') ? photoField : `/${photoField}`;
                const fullPath = `${baseUrl}${path}`;
                emp.UserPhoto = fullPath;
                emp.Photo = fullPath;
            }
            return emp;
        });
    }

    return rows;
};

module.exports = Dashboard;
