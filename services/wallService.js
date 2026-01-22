const db = require('../models');
const { Wall, Employee } = db;
const fs = require('fs');

/**
 * Get all walls
 * @returns {Promise<Array>} List of walls
 */
exports.getAllWalls = async () => {
    return await Wall.findAll({
        where: { IsDeleted: false },
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
        ],
        order: [['CreatedOn', 'DESC']]
    });
};

/**
 * Get wall by ID
 * @param {number} id - Wall ID
 * @returns {Promise<Object>} Wall
 */
exports.getWallById = async (id) => {
    return await Wall.findByPk(id, {
        include: [
            { model: Employee, as: 'addedBy', attributes: ['Id', 'FirstName', 'LastName'] }
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
