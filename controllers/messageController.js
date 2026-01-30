const messageService = require('../services/messageService');

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
        const message = await messageService.createMessage(req.body);
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

        const updatedMessage = await messageService.updateMessage(message, req.body);
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
