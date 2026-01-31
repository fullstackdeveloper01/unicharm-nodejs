const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/superAdmin/role.controller.js');

// Role CRUD routes
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

// Helper route for dropdown
router.get('/dropdowns/list', roleController.selectRoles);

module.exports = router;
