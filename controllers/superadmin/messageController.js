const messageService = require('../../services/superadmin/messageService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const search = req.query.search || '';

        const { count, rows } = await messageService.getAllMessages(page, limit, search);

        const pagination = {
            total: count,
            page: page,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1,
            hasNext: limit ? page * limit < count : false
        };

        res.json({
            success: true,
            message: 'Messages retrieved successfully',
            data: rows,
            pagination
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve messages', null, { message: error.message });
    }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageService.getMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Message not found');
        }

        sendResponse(res, true, 'Message retrieved successfully', message);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve message', null, { message: error.message });
    }
};

// Create message
exports.createMessage = async (req, res) => {
    try {
        const { Title } = req.body;

        if (!Title || !Title.trim()) {
            return sendResponse(res, false, 'Title is required');
        }

        // Prepare data with correct casing for Model
        const messageData = { ...req.body };

        // Map Role/role/roleId -> RoleId
        if (req.body.role || req.body.roleId) {
            messageData.RoleId = req.body.role || req.body.roleId;
        }

        // Map addedBy -> AddedBy
        // Use AddedBy from body if present (prioritize body for admin override), else fallback to user token
        const bodyAddedBy = req.body.AddedBy || req.body.addedBy;

        if (bodyAddedBy) {
            messageData.AddedBy = bodyAddedBy;
        } else if (req.user && req.user.id) {
            messageData.AddedBy = req.user.id;
        }

        const message = await messageService.createMessage(messageData);
        res.status(201);
        sendResponse(res, true, 'Message created successfully', message);
    } catch (error) {
        sendResponse(res, false, 'Failed to create message', null, { message: error.message });
    }
};

// Update message
exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageService.getMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Message not found');
        }

        // Prepare data with correct casing
        const messageData = { ...req.body };

        // Map Role/role/roleId -> RoleId
        if (req.body.role || req.body.roleId) {
            messageData.RoleId = req.body.role || req.body.roleId;
        }

        // Map addedBy -> AddedBy
        const bodyAddedBy = req.body.AddedBy || req.body.addedBy;
        if (bodyAddedBy) {
            messageData.AddedBy = bodyAddedBy;
        } else if (req.user && req.user.id && !message.AddedBy) {
            // Only set default if not provided AND existing is empty (optional logic, but stick to pattern)
            // Actually user pattern was "if missing, default to user".
            if (!req.body.AddedBy && !req.body.addedBy) {
                messageData.AddedBy = req.user.id;
            }
        }

        // Simpler logic matching create: override if body has it, else default if logic requires (usually updates might just keep existing)
        // But the requirement said "added by is not updating". So if body has it, we MUST update it.
        if (bodyAddedBy) {
            messageData.AddedBy = bodyAddedBy;
        }

        const updatedMessage = await messageService.updateMessage(message, messageData);
        sendResponse(res, true, 'Message updated successfully', updatedMessage);
    } catch (error) {
        sendResponse(res, false, 'Failed to update message', null, { message: error.message });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageService.getMessageById(id);

        if (!message) {
            return sendResponse(res, false, 'Message not found');
        }

        await messageService.deleteMessage(message);
        sendResponse(res, true, 'Message deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete message', null, { message: error.message });
    }
};
