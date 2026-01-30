const wishService = require('../../services/employee/wish.service');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Send a wish
exports.sendWish = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { recipientId, type, comment, eventDate } = req.body;

        if (!recipientId || !type || !comment) {
            return sendResponse(res, false, 'Recipient, type, and comment are required');
        }

        const wish = await wishService.sendWish({
            Type: type,
            BirthdateUsertId: recipientId,
            Birthdate: eventDate || new Date(), // Use provided date or today
            Comment: comment,
            CommentUserId: senderId
        });

        sendResponse(res, true, 'Wish sent successfully', wish);
    } catch (error) {
        sendResponse(res, false, 'Failed to send wish', null, { message: error.message });
    }
};

// Get wishes for a user
exports.getWishes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type } = req.query;

        const wishes = await wishService.getWishes(userId, type);
        sendResponse(res, true, 'Wishes retrieved successfully', wishes);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve wishes', null, { message: error.message });
    }
};
