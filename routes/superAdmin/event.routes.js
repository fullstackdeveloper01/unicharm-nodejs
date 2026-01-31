const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/superAdmin/event.controller.js');

// Event CRUD routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
