const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designationController');

// Designation CRUD routes
router.get('/', designationController.getAllDesignations);
router.get('/:id', designationController.getDesignationById);
router.post('/', designationController.createDesignation);
router.put('/:id', designationController.updateDesignation);
router.delete('/:id', designationController.deleteDesignation);

// Helper routes for dropdowns
router.get('/dropdowns/list', designationController.selectDesignations);
router.get('/dropdowns/expense-designations', designationController.selectExpenseDesignations);

module.exports = router;
