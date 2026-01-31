
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Wall, WallLike, WallComment } = require('../../../models/employee/intra');
const { Employee } = require('../../../models/superAdmin');






/**
 * Get all walls
 * @param {number} page
 * @param {number} limit
 * @param {string} search
 * @returns {Promise<Object>} { count, rows }
 */
const getAllWalls = async (page = 1, limit = 10, search = '') => {
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
        queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    return await Wall.findAndCountAll(queryOptions);
};

/**
 * Get wall by ID
 * @param {number} id - Wall ID
 * @returns {Promise<Object>} Wall
 */
const getWallById = async (id) => {
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
const createWall = async (data) => {
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
const updateWall = async (wall, data) => {
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
const deleteWall = async (wall) => {
    return await wall.update({ IsDeleted: true });
};

/**
 * Toggle like on a wall
 * @param {number} wallId 
 * @param {number} employeeId 
 * @returns {Promise<Object>} Result status
 */
const toggleLike = async (wallId, employeeId) => {
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
const addComment = async (data) => {
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
const deleteComment = async (commentId, employeeId) => {
    const comment = await WallComment.findOne({
        where: { Id: commentId, EmployeeId: employeeId, IsDeleted: false }
    });

    if (!comment) return false;

    await comment.update({ IsDeleted: true });
    return true;
};

// -----------------------------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/walls/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'wall-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all walls
exports.getAllWalls = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const result = await getAllWalls(page, limit, search);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Walls retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve walls', null, { message: error.message });
    }
};

// Get wall by ID
exports.getWallById = async (req, res) => {
    try {
        const { id } = req.params;
        const wall = await getWallById(id);

        if (!wall) {
            return sendResponse(res, false, 'Wall not found');
        }

        sendResponse(res, true, 'Wall retrieved successfully', wall);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve wall', null, { message: error.message });
    }
};

// Create wall
exports.createWall = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, Description } = req.body;
                // AddedBy should be taken from the authenticated user token
                const AddedBy = req.user ? req.user.id : req.body.AddedBy;

                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/walls/${req.file.filename}`;
                }

                if (!Title && !Description && !imagePath) {
                    return sendResponse(res, false, 'Wall post must contain some content');
                }

                const wall = await createWall({
                    Title,
                    Description,
                    AddedBy,
                    Image: imagePath
                });

                res.status(201);
                sendResponse(res, true, 'Wall created successfully', wall);
            } catch (error) {
                sendResponse(res, false, 'Failed to create wall', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update wall
exports.updateWall = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const wall = await getWallById(id);
                if (!wall) {
                    return sendResponse(res, false, 'Wall not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/walls/${req.file.filename}`;
                }

                const updatedWall = await updateWall(wall, updateData);
                sendResponse(res, true, 'Wall updated successfully', updatedWall);
            } catch (error) {
                sendResponse(res, false, 'Failed to update wall', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete wall (soft delete)
exports.deleteWall = async (req, res) => {
    try {
        const { id } = req.params;
        const wall = await getWallById(id);

        if (!wall) {
            return sendResponse(res, false, 'Wall not found');
        }

        await deleteWall(wall);
        sendResponse(res, true, 'Wall deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete wall', null, { message: error.message });
    }
};

// Toggle like
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params; // Wall ID
        const employeeId = req.user.id; // Note: Ensure inconsistent casing of Id/id is handled. Middleware sets req.user.

        console.log(`Toggling like for WallId: ${id}, EmployeeId: ${employeeId}`);
        const result = await toggleLike(id, employeeId);
        console.log(`Toggle like result:`, result);
        sendResponse(res, true, result.liked ? 'Liked' : 'Unliked', result);
    } catch (error) {
        sendResponse(res, false, 'Failed to toggle like', null, { message: error.message });
    }
};

// Add comment
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params; // Wall ID
        const { comment } = req.body;
        const employeeId = req.user.id;

        if (!comment) {
            return sendResponse(res, false, 'Comment cannot be empty');
        }

        const newComment = await addComment({
            WallId: id,
            EmployeeId: employeeId,
            Comment: comment
        });

        sendResponse(res, true, 'Comment added successfully', newComment);
    } catch (error) {
        sendResponse(res, false, 'Failed to add comment', null, { message: error.message });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const employeeId = req.user.id;

        const success = await deleteComment(commentId, employeeId);

        if (success) {
            sendResponse(res, true, 'Comment deleted successfully');
        } else {
            sendResponse(res, false, 'Comment not found or you do not have permission to delete it');
        }
    } catch (error) {
        sendResponse(res, false, 'Failed to delete comment', null, { message: error.message });
    }
};
