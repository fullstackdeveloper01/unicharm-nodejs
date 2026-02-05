const db = require('../../models');
const { Policy } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all policies
 * @returns {Promise<Array>} List of policies
 */
exports.getAllPolicies = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({ Title: { [Op.like]: `%${search}%` } });
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const result = await Policy.findAndCountAll(queryOptions);

    // Prepend base URL to PDF paths
    const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
    const rows = result.rows.map(policy => {
        const p = policy.toJSON();
        if (p.PdfPath) {
            if (!p.PdfPath.startsWith('http')) {
                const path = p.PdfPath.startsWith('/') ? p.PdfPath : `/${p.PdfPath}`;
                p.PdfPath = `${baseUrl}${path}`;
            }
        }
        if (p.Image) {
            if (!p.Image.startsWith('http')) {
                const path = p.Image.startsWith('/') ? p.Image : `/${p.Image}`;
                p.Image = `${baseUrl}${path}`;
            }
        }
        return p;
    });

    return { count: result.count, rows };
};

/**
 * Get policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} Policy
 */
exports.getPolicyById = async (id) => {
    const policy = await Policy.findByPk(id);

    if (policy) {
        const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
        const p = policy.toJSON();

        if (p.PdfPath && !p.PdfPath.startsWith('http')) {
            const path = p.PdfPath.startsWith('/') ? p.PdfPath : `/${p.PdfPath}`;
            p.PdfPath = `${baseUrl}${path}`;
        }
        if (p.Image && !p.Image.startsWith('http')) {
            const path = p.Image.startsWith('/') ? p.Image : `/${p.Image}`;
            p.Image = `${baseUrl}${path}`;
        }

        return p;
    }

    return policy;
};

/**
 * Create policy
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policy
 */
exports.createPolicy = async (data) => {
    const existing = await Policy.findOne({
        where: {
            Title: data.Title,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });

    if (existing) {
        throw new Error('same entires notallowed');
    }
    return await Policy.create({
        ...data,
        CreatedOn: new Date(),
        ModifiedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update policy
 * @param {Object} policy - Policy instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated policy
 */
exports.updatePolicy = async (policy, data) => {
    if (data.Title && data.Title !== policy.Title) {
        const existing = await Policy.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: policy.Id }
            }
        });

        if (existing) {
            throw new Error('same entires notallowed');
        }
    }
    // Handle file replacement
    if (data.PdfPath && policy.PdfPath && data.PdfPath !== policy.PdfPath) {
        if (fs.existsSync(policy.PdfPath.replace('/', ''))) {
            try {
                fs.unlinkSync(policy.PdfPath.replace('/', ''));
            } catch (e) { console.error('Error deleting old policy pdf', e); }
        }
    }
    return await policy.update({
        ...data,
        ModifiedOn: new Date()
    });
};

/**
 * Delete policy (soft delete)
 * @param {Object} policy - Policy instance
 * @returns {Promise<Object>} Deleted policy
 */
exports.deletePolicy = async (policy) => {
    return await policy.update({ IsDeleted: true });
};
