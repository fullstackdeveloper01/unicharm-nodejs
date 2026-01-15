const db = require('../models');
const { Department } = db;

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { IsDeleted: false },
      order: [['CreatedOn', 'DESC']]
    });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { DepartmentName } = req.body;

    if (!DepartmentName) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const department = await Department.create({
      DepartmentName,
      CreatedOn: new Date(),
      IsDeleted: false
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { DepartmentName } = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await department.update({ DepartmentName });
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete department (soft delete)
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await department.update({ IsDeleted: true });
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper method for dropdown
exports.selectDepartments = async () => {
  const departments = await Department.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DepartmentName']
  });
  return departments.map(dept => ({ value: dept.Id, text: dept.DepartmentName }));
};
