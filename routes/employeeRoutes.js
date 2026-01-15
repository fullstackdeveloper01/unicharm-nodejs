const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Employee CRUD routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.patch('/:id/toggle-delete', employeeController.toggleSoftDelete);

// Helper routes for dropdowns
router.get('/dropdowns/departments', async (req, res) => {
  try {
    const departments = await employeeController.selectDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/designations', async (req, res) => {
  try {
    const designations = await employeeController.selectDesignations();
    res.json({ success: true, data: designations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/roles', async (req, res) => {
  try {
    const roles = await employeeController.selectRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/supervisors', async (req, res) => {
  try {
    const supervisors = await employeeController.selectEmployeesAsSupervisor();
    res.json({ success: true, data: supervisors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/employees', async (req, res) => {
  try {
    const employees = await employeeController.selectEmployees();
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/units', async (req, res) => {
  try {
    const units = await employeeController.selectUnits();
    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/zones', async (req, res) => {
  try {
    const zones = await employeeController.selectZones();
    res.json({ success: true, data: zones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/locations', async (req, res) => {
  try {
    const locations = await employeeController.selectLocations();
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/user-categories', async (req, res) => {
  try {
    const categories = await employeeController.selectUserCategory();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/user-types', async (req, res) => {
  try {
    const types = await employeeController.selectUserType();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dropdowns/ttmt', async (req, res) => {
  try {
    const ttmt = await employeeController.selectTTMT();
    res.json({ success: true, data: ttmt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
