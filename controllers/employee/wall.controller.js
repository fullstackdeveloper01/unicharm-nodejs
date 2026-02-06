const wallService = require('../../services/employee/wall.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

        const result = await wallService.getAllWalls(page, limit, search);

        // Robust Base URL logic
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

        const rows = result.rows.map(wall => {
            const w = wall.toJSON();

            // Process Wall Image
            if (w.Image && !w.Image.startsWith('http')) {
                let imagePath = w.Image.replace(/\\/g, '/'); // Normalize backslashes

                // If it's just a filename (no slashes), assume it's in uploads/walls/
                if (!imagePath.includes('/')) {
                    imagePath = `/uploads/walls/${imagePath}`;
                }

                // Ensure leading slash
                if (!imagePath.startsWith('/')) {
                    imagePath = `/${imagePath}`;
                }

                w.Image = `${baseUrl}${imagePath}`;
            }

            // Process user photos in addedBy
            if (w.addedBy && w.addedBy.UserPhoto && !w.addedBy.UserPhoto.startsWith('http')) {
                let photoPath = w.addedBy.UserPhoto.replace(/\\/g, '/');
                // Handle bare filenames for profile images (legacy vs new)
                if (!photoPath.includes('/')) {
                    if (photoPath.startsWith('profile-')) {
                        photoPath = `/uploads/profile/${photoPath}`;
                    } else {
                        photoPath = `/Images/Profile/${photoPath}`;
                    }
                }
                if (!photoPath.startsWith('/')) photoPath = `/${photoPath}`;
                w.addedBy.UserPhoto = `${baseUrl}${photoPath}`;
            }

            // Process comments user photos
            if (w.comments) {
                w.comments = w.comments.map(comment => {
                    if (comment.employee && comment.employee.UserPhoto && !comment.employee.UserPhoto.startsWith('http')) {
                        let photoPath = comment.employee.UserPhoto.replace(/\\/g, '/');
                        if (!photoPath.includes('/')) {
                            if (photoPath.startsWith('profile-')) {
                                photoPath = `/uploads/profile/${photoPath}`;
                            } else {
                                photoPath = `/Images/Profile/${photoPath}`;
                            }
                        }
                        if (!photoPath.startsWith('/')) photoPath = `/${photoPath}`;
                        comment.employee.UserPhoto = `${baseUrl}${photoPath}`;
                    }
                    return comment;
                });
            }
            return w;
        });

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Walls retrieved successfully', rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve walls', null, { message: error.message });
    }
};

// Get wall by ID
exports.getWallById = async (req, res) => {
    try {
        const { id } = req.params;
        const wall = await wallService.getWallById(id);

        if (!wall) {
            return sendResponse(res, false, 'Wall not found');
        }

        const data = wall.toJSON();
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

        if (data.Image && !data.Image.startsWith('http')) {
            let imagePath = data.Image.replace(/\\/g, '/');
            if (!imagePath.includes('/')) {
                imagePath = `/uploads/walls/${imagePath}`;
            }
            if (!imagePath.startsWith('/')) {
                imagePath = `/${imagePath}`;
            }
            data.Image = `${baseUrl}${imagePath}`;
        }

        // Process user photos
        if (data.addedBy && data.addedBy.UserPhoto && !data.addedBy.UserPhoto.startsWith('http')) {
            let photoPath = data.addedBy.UserPhoto.replace(/\\/g, '/');
            if (!photoPath.includes('/')) {
                if (photoPath.startsWith('profile-')) {
                    photoPath = `/uploads/profile/${photoPath}`;
                } else {
                    photoPath = `/Images/Profile/${photoPath}`;
                }
            }
            if (!photoPath.startsWith('/')) photoPath = `/${photoPath}`;
            data.addedBy.UserPhoto = `${baseUrl}${photoPath}`;
        }

        if (data.comments) {
            data.comments = data.comments.map(comment => {
                if (comment.employee && comment.employee.UserPhoto && !comment.employee.UserPhoto.startsWith('http')) {
                    let photoPath = comment.employee.UserPhoto.replace(/\\/g, '/');
                    if (!photoPath.includes('/')) {
                        if (photoPath.startsWith('profile-')) {
                            photoPath = `/uploads/profile/${photoPath}`;
                        } else {
                            photoPath = `/Images/Profile/${photoPath}`;
                        }
                    }
                    if (!photoPath.startsWith('/')) photoPath = `/${photoPath}`;
                    comment.employee.UserPhoto = `${baseUrl}${photoPath}`;
                }
                return comment;
            });
        }

        sendResponse(res, true, 'Wall retrieved successfully', data);
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
                // AddedBy should be prioritised from body if provided (e.g. admin posting as someone else), else fallback to token user
                const AddedBy = req.body.AddedBy || (req.user ? req.user.id : null);

                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/walls/${req.file.filename}`;
                }

                if (!Title && !Description && !imagePath) {
                    return sendResponse(res, false, 'Wall post must contain some content');
                }

                const wall = await wallService.createWall({
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
                const wall = await wallService.getWallById(id);
                if (!wall) {
                    return sendResponse(res, false, 'Wall not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/walls/${req.file.filename}`;
                }

                const updatedWall = await wallService.updateWall(wall, updateData);
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
        const wall = await wallService.getWallById(id);

        if (!wall) {
            return sendResponse(res, false, 'Wall not found');
        }

        await wallService.deleteWall(wall);
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
        const result = await wallService.toggleLike(id, employeeId);
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

        const newComment = await wallService.addComment({
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

        const success = await wallService.deleteComment(commentId, employeeId);

        if (success) {
            sendResponse(res, true, 'Comment deleted successfully');
        } else {
            sendResponse(res, false, 'Comment not found or you do not have permission to delete it');
        }
    } catch (error) {
        sendResponse(res, false, 'Failed to delete comment', null, { message: error.message });
    }
};
