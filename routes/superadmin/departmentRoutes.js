const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/superadmin/departmentController');

// Department CRUD routes
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

// Helper route for dropdown
// Helper route for dropdown
router.get('/dropdowns/list', departmentController.selectDepartments);

module.exports = router;
