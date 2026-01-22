const eventService = require('../services/eventService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
const sendResponse = (res, success, message, data = null, errors = null) => {
    res.json({
        success,
        message,
        data,
        errors
    });
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        sendResponse(res, true, 'Events retrieved successfully', events);
    } catch (error) {
        sendResponse(res, false, 'Failed to retrieve events', null, { message: error.message });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await eventService.getEventById(id);

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

                const event = await eventService.createEvent({
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
                const event = await eventService.getEventById(id);
                if (!event) {
                    return sendResponse(res, false, 'Event not found');
                }

                const updateData = { ...req.body };

                if (req.file) {
                    updateData.Image = `/uploads/events/${req.file.filename}`;
                }

                const updatedEvent = await eventService.updateEvent(event, updateData);
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
        const event = await eventService.getEventById(id);

        if (!event) {
            return sendResponse(res, false, 'Event not found');
        }

        await eventService.deleteEvent(event);
        sendResponse(res, true, 'Event deleted successfully');
    } catch (error) {
        sendResponse(res, false, 'Failed to delete event', null, { message: error.message });
    }
};
