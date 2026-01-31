
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { TodaysBirthdateAndAnniversary, Employee } = require('../../../models/superAdmin');



/**
 * Send a wish (birthday or anniversary)
 * @param {Object} data 
 * @returns {Promise<Object>} Created wish
 */
const sendWish = async (data) => {
    return await TodaysBirthdateAndAnniversary.create({
        ...data,
        CreatedOn: new Date()
    });
};

/**
 * Get wishes for a user
 * @param {number} userId 
 * @param {string} type - Optional filter by type
 * @returns {Promise<Array>} List of wishes
 */
const getWishes = async (userId, type = null) => {
    const where = { BirthdateUsertId: userId };
    if (type) {
        where.Type = type;
    }

    return await TodaysBirthdateAndAnniversary.findAll({
        where: where,
        include: [
            { model: Employee, as: 'sender', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] }
        ],
        order: [['CreatedOn', 'DESC']]
    });
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

// Send a wish
exports.sendWish = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { recipientId, type, comment, eventDate } = req.body;

        if (!recipientId || !type || !comment) {
            return sendResponse(res, false, 'Recipient, type, and comment are required');
        }

        const wish = await sendWish({
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

        const wishes = await getWishes(userId, type);
        sendResponse(res, true, 'Wishes retrieved successfully', wishes);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve wishes', null, { message: error.message });
    }
};
