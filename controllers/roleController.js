const { Op } = require('sequelize');
const db = require('../models');
const { Role } = db;

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: {
        [Op.or]: [
          { IsDeleted: false },
          { IsDeleted: null },
          { IsDeleted: 0 }
        ]
      },
      order: [['CreatedOn', 'DESC']]
    });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create role
exports.createRole = async (req, res) => {
  try {
    const { RoleName } = req.body;

    if (!RoleName) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const role = await Role.create({
      RoleName,
      CreatedOn: new Date(),
      IsDeleted: false
    });

    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { RoleName } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    await role.update({ RoleName });
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete role (soft delete)
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    await role.update({ IsDeleted: true });
    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper method for dropdown
exports.selectRoles = async () => {
  const roles = await Role.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'RoleName']
  });
  return roles.map(role => ({ value: role.Id, text: role.RoleName }));
};
