const express = require('express');
const router = express.Router();
const choreiMessageController = require('../controllers/choreiMessageController');

// Chorei Message CRUD routes
router.get('/', choreiMessageController.getAllChoreiMessages);
router.get('/:id', choreiMessageController.getChoreiMessageById);
router.post('/', choreiMessageController.createChoreiMessage);
router.put('/:id', choreiMessageController.updateChoreiMessage);
router.delete('/:id', choreiMessageController.deleteChoreiMessage);

module.exports = router;
