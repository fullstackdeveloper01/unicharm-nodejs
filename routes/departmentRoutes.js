const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Department CRUD routes
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

// Helper route for dropdown
router.get('/dropdowns/list', async (req, res) => {
  try {
    const departments = await departmentController.selectDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
