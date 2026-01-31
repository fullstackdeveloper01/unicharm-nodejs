const express = require('express');
const router = express.Router();
const choreiMessageController = require('../../controllers/superAdmin/choreiMessage.controller.js');

// Chorei Message CRUD routes
router.get('/', choreiMessageController.getAllChoreiMessages);
router.get('/:id', choreiMessageController.getChoreiMessageById);
router.post('/', choreiMessageController.createChoreiMessage);
router.put('/:id', choreiMessageController.updateChoreiMessage);
router.delete('/:id', choreiMessageController.deleteChoreiMessage);

module.exports = router;
