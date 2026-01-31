const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/superAdmin/employee.controller.js');

// Employee CRUD routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.patch('/:id/toggle-delete', employeeController.toggleSoftDelete);

// Helper routes for dropdowns
router.get('/dropdowns/departments', employeeController.selectDepartments);
router.get('/dropdowns/designations', employeeController.selectDesignations);
router.get('/dropdowns/roles', employeeController.selectRoles);
router.get('/dropdowns/supervisors', employeeController.selectEmployeesAsSupervisor);
router.get('/dropdowns/employees', employeeController.selectEmployees);
router.get('/dropdowns/units', employeeController.selectUnits);
router.get('/dropdowns/zones', employeeController.selectZones);
router.get('/dropdowns/locations', employeeController.selectLocations);
router.get('/dropdowns/user-categories', employeeController.selectUserCategory);
router.get('/dropdowns/user-types', employeeController.selectUserType);
router.get('/dropdowns/ttmt', employeeController.selectTTMT);

module.exports = router;
