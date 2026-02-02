const db = require('../../models');
const { Policy } = db;
const { Op } = require('sequelize');

/**
 * Get all policies with pagination and search
 * @param {number} page 
 * @param {number} limit 
 * @param {string} search 
 * @returns {Promise<Object>} List of policies and pagination info
 */
exports.getAllPolicies = async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    const where = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null }
        ]
    };

    if (search) {
        where[Op.and] = [
            {
                [Op.or]: [
                    { Title: { [Op.like]: `%${search}%` } },
                    { Description: { [Op.like]: `%${search}%` } }
                ]
            }
        ];
    }

    const { count, rows } = await Policy.findAndCountAll({
        where: where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['CreatedOn', 'DESC']]
    });

    // Helper to format image URL if needed
    // Assuming backend serves static files or these are external links.
    // If they are local paths stored in DB, we might want to ensure they are accessible.
    const policies = rows.map(policy => {
        const p = policy.toJSON();
        // If Image is not absolute, ensure it has a proper prefix if it's a local upload
        // For now, returning as is, but can be enhanced based on specific file storage strategy
        return p;
    });

    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        policies: policies
    };
};

/**
 * Get policy by ID
 * @param {number} id 
 * @returns {Promise<Object>} Policy
 */
exports.getPolicyById = async (id) => {
    return await Policy.findByPk(id);
};
