const db = require('../models');
const { Event } = db;
const fs = require('fs');
const { Op } = require('sequelize');

/**
 * Get all events
 * @returns {Promise<Array>} List of events
 */
exports.getAllEvents = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Event.findAndCountAll(queryOptions);
};

/**
 * Get event by ID
 * @param {number} id - Event ID
 * @returns {Promise<Object>} Event
 */
exports.getEventById = async (id) => {
    return await Event.findByPk(id);
};

/**
 * Create event
 * @param {Object} data - Event data
 * @returns {Promise<Object>} Created event
 */
exports.createEvent = async (data) => {
    return await Event.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update event
 * @param {Object} event - Event instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated event
 */
exports.updateEvent = async (event, data) => {
    // Handle file replacement
    if (data.Image && event.Image && data.Image !== event.Image) {
        if (fs.existsSync(event.Image.replace('/', ''))) {
            try {
                fs.unlinkSync(event.Image.replace('/', ''));
            } catch (e) { console.error('Error deleting old event image', e); }
        }
    }
    return await event.update(data);
};

/**
 * Delete event (soft delete)
 * @param {Object} event - Event instance
 * @returns {Promise<Object>} Deleted event
 */
exports.deleteEvent = async (event) => {
    return await event.update({ IsDeleted: true });
};
