const express = require('express');
const router = express.Router();
const emergencyResponseController = require('../controllers/emergencyResponseController');

// CRUD routes
router.get('/', emergencyResponseController.getAllRecords);
router.get('/:id', emergencyResponseController.getRecordById);
router.post('/', emergencyResponseController.createRecord);
router.put('/:id', emergencyResponseController.updateRecord);
router.delete('/:id', emergencyResponseController.deleteRecord);

module.exports = router;
