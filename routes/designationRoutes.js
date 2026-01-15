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
router.get('/dropdowns/list', async (req, res) => {
  try {
    const designations = await designationController.selectDesignations();
    res.json({ success: true, data: designations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/expense-designations', async (req, res) => {
  try {
    const designations = await designationController.selectExpenseDesignations();
    res.json({ success: true, data: designations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
