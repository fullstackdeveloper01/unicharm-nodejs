
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Policy } = require('../../../models/superAdmin');



/**
 * Get all policies with pagination and search
 * @param {number} page 
 * @param {number} limit 
 * @param {string} search 
 * @returns {Promise<Object>} List of policies and pagination info
 */
const getAllPolicies = async (page = 1, limit = 10, search = '') => {
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
const getPolicyById = async (id) => {
    return await Policy.findByPk(id);
};

// -----------------------------


// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all policies
exports.getAllPolicies = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await getAllPolicies(page, limit, search);
        sendResponse(res, true, 'Policies retrieved successfully', result);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policies', null, { message: error.message });
    }
};

// Get policy by ID
exports.getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await getPolicyById(id);

        if (!policy) {
            return sendResponse(res, false, 'Policy not found');
        }

        sendResponse(res, true, 'Policy retrieved successfully', policy);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve policy', null, { message: error.message });
    }
};
