const db = require('../../models');

/**
 * Get upcoming birthdays
 * @returns {Promise<Array>} List of upcoming birthdays
 */
exports.getUpcomingBirthdays = async () => {
    return await db.Employee.getUpcomingBirthdays();
};

/**
 * Get work anniversaries
 * @returns {Promise<Array>} List of work anniversaries
 */
exports.getWorkAnniversaries = async () => {
    return await db.Dashboard.getWorkAnniversary();
};

/**
 * Get company policies
 * @returns {Promise<Array>} List of company policies
 */
exports.getCompanyPolicies = async () => {
    return await db.Dashboard.getRecentPolicies();
};

/**
 * Get recent news
 * @returns {Promise<Array>} List of recent news
 */
exports.getRecentNews = async () => {
    return await db.Dashboard.getRecentNews();
};

/**
 * Get upcoming events
 * @returns {Promise<Array>} List of upcoming events
 */
exports.getUpcomingEvents = async () => {
    return await db.Dashboard.getRecentEvent();
};

/**
 * Get employee statistics for dashboard
 * @returns {Promise<Object>} Statistics object
 */
exports.getEmployeeStats = async () => {
    const { Op } = db.Sequelize;

    // Total Employees
    const totalEmployees = await db.Employee.count({
        where: { IsDeleted: false }
    });

    // Sales Employees (assuming Department has 'Sales' in name)
    const totalSales = await db.Employee.count({
        where: { IsDeleted: false },
        include: [{
            model: db.Department,
            as: 'department',
            where: {
                DepartmentName: { [Op.like]: '%Sales%' }
            },
            required: true
        }]
    });

    // Corporate Employees (assuming Department has 'Corporate' in name)
    const totalCorporate = await db.Employee.count({
        where: { IsDeleted: false },
        include: [{
            model: db.Department,
            as: 'department',
            where: {
                DepartmentName: { [Op.like]: '%Corporate%' }
            },
            required: true
        }]
    });

    return {
        totalEmployees,
        totalSales,
        totalCorporate
    };
};
