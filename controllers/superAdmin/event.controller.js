
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Event } = require('../../models/superAdmin');




/**
 * Get all events
 * @returns {Promise<Array>} List of events
 */
const getAllEvents = async (page = 1, limit = null) => {
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
const getEventById = async (id) => {
    return await Event.findByPk(id);
};

/**
 * Create event
 * @param {Object} data - Event data
 * @returns {Promise<Object>} Created event
 */
const createEvent = async (data) => {
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
const updateEvent = async (event, data) => {
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
const deleteEvent = async (event) => {
    return await event.update({ IsDeleted: true });
};

// -----------------------------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/events/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllEvents(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Events retrieved successfully', result.rows, null, pagination);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve events', null, { message: error.message });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await getEventById(id);

        if (!event) {
            return sendResponse(res, false, 'Event not found');
        }

        sendResponse(res, true, 'Event retrieved successfully', event);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve event', null, { message: error.message });
    }
};

// Create event
exports.createEvent = async (req, res) => {
    try {
        const uploadMiddleware = upload.single('file'); // 'file' key for image

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const { Title, Description, EventDate } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/events/${req.file.filename}`;
                }

                const event = await createEvent({
                    Title,
                    Description,
                    EventDate,
                    Image: imagePath
                });

                res.status(201);
                sendResponse(res, true, 'Event created successfully', event);
            } catch (error) {
                sendResponse(res, false, 'Failed to create event', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadMiddleware = upload.single('file');

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return sendResponse(res, false, 'File upload failed', null, { message: err.message });
            }

            try {
                const event = await getEventById(id);
                if (!event) {
                    return sendResponse(res, false, 'Event not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/events/${req.file.filename}`;
                }

                const updatedEvent = await updateEvent(event, updateData);
                sendResponse(res, true, 'Event updated successfully', updatedEvent);
            } catch (error) {
                sendResponse(res, false, 'Failed to update event', null, { message: error.message });
            }
        });
    } catch (error) {
        sendResponse(res, false, 'Failed to process request', null, { message: error.message });
    }
};

// Delete event (soft delete)
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await getEventById(id);

        if (!event) {
            return sendResponse(res, false, 'Event not found');
        }

        await deleteEvent(event);
        sendResponse(res, true, 'Event deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete event', null, { message: error.message });
    }
};
