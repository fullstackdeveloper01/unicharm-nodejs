const db = require('../../models');
const { Wall, Employee, WallLike, WallComment } = db;
const fs = require('fs');

/**
 * Get all walls
 * @returns {Promise<Array>} List of walls
 */
const { Op } = require('sequelize');

/**
 * Get all walls
 * @param {number} page
 * @param {number} limit
 * @param {string} search
 * @returns {Promise<Object>} { count, rows }
 */
exports.getAllWalls = async (page = 1, limit = 10, search = '') => {
    const where = { IsDeleted: false };

    if (search) {
        where[Op.or] = [
            { Title: { [Op.like]: `%${search}%` } },
            { Description: { [Op.like]: `%${search}%` } }
        ];
    }

    const queryOptions = {
        where,
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] },
            {
                model: WallLike,
                as: 'likes',
                include: [{ model: Employee, as: 'employee', attributes: ['Id', 'FirstName', 'LastName'] }]
            },
            {
                model: WallComment,
                as: 'comments', // Note: Comments are fetched. If this creates too much data, consider separate API or limit.
                where: { IsDeleted: false },
                required: false,
                include: [{ model: Employee, as: 'employee', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] }]
            }
        ],
        distinct: true,
        order: [['CreatedOn', 'DESC']]
    };

    if (limit) {
        queryOptions.limit = parseInt(limit);
        queryOptions.offset = (page - 1) * limit;
    }

    return await Wall.findAndCountAll(queryOptions);
};

/**
 * Get wall by ID
 * @param {number} id - Wall ID
 * @returns {Promise<Object>} Wall
 */
exports.getWallById = async (id) => {
    return await Wall.findByPk(id, {
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] },
            {
                model: WallLike,
                as: 'likes',
                include: [{ model: Employee, as: 'employee', attributes: ['Id', 'FirstName', 'LastName'] }]
            },
            {
                model: WallComment,
                as: 'comments',
                where: { IsDeleted: false },
                required: false,
                include: [{ model: Employee, as: 'employee', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] }]
            }
        ]
    });
};

/**
 * Create wall
 * @param {Object} data - Wall data
 * @returns {Promise<Object>} Created wall
 */
exports.createWall = async (data) => {
    return await Wall.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update wall
 * @param {Object} wall - Wall instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated wall
 */
exports.updateWall = async (wall, data) => {
    // Handle file replacement
    if (data.Image && wall.Image && data.Image !== wall.Image) {
        if (fs.existsSync(wall.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(wall.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old wall image', e); }
        }
    }
    return await wall.update(data);
};

/**
 * Delete wall (soft delete)
 * @param {Object} wall - Wall instance
 * @returns {Promise<Object>} Deleted wall
 */
exports.deleteWall = async (wall) => {
    return await wall.update({ IsDeleted: true });
};

/**
 * Toggle like on a wall
 * @param {number} wallId 
 * @param {number} employeeId 
 * @returns {Promise<Object>} Result status
 */
exports.toggleLike = async (wallId, employeeId) => {
    console.log(`[Service] Checking like for WallId: ${wallId}, EmployeeId: ${employeeId}`);
    const existingLike = await WallLike.findOne({
        where: { WallId: wallId, EmployeeId: employeeId }
    });

    if (existingLike) {
        console.log(`[Service] Found existing like (Id: ${existingLike.Id}). Removing it.`);
        await existingLike.destroy();
        return { liked: false };
    } else {
        console.log(`[Service] No existing like found. Creating new like.`);
        const newLike = await WallLike.create({
            WallId: wallId,
            EmployeeId: employeeId,
            CreatedOn: new Date()
        });
        console.log(`[Service] Created new like:`, newLike.toJSON());
        return { liked: true };
    }
};

/**
 * Add comment to a wall
 * @param {Object} data 
 * @returns {Promise<Object>} Created comment
 */
exports.addComment = async (data) => {
    return await WallComment.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Delete comment (soft delete)
 * @param {number} commentId 
 * @param {number} employeeId - To ensure ownership
 * @returns {Promise<boolean>} Success
 */
exports.deleteComment = async (commentId, employeeId) => {
    const comment = await WallComment.findOne({
        where: { Id: commentId, EmployeeId: employeeId, IsDeleted: false }
    });

    if (!comment) return false;

    await comment.update({ IsDeleted: true });
    return true;
};
