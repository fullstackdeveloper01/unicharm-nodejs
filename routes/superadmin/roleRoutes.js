const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/superadmin/roleController');

// Role CRUD routes
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

// Helper route for dropdown
router.get('/dropdowns/list', async (req, res) => {
  try {
    const roles = await roleController.selectRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
