const db = require('../models');
const { Designation, Department } = db;

// Get all designations
exports.getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.findAll({
      where: { IsDeleted: false },
      include: [
        { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] }
      ],
      order: [['CreatedOn', 'DESC']]
    });
    res.json({ success: true, data: designations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get designation by ID
exports.getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await Designation.findByPk(id, {
      include: [{ model: Department, as: 'department' }]
    });

    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }

    res.json({ success: true, data: designation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create designation
exports.createDesignation = async (req, res) => {
  try {
    const { DesignationName, DepartmentId } = req.body;

    if (!DesignationName) {
      return res.status(400).json({ success: false, message: 'Designation name is required' });
    }

    const designation = await Designation.create({
      DesignationName,
      DepartmentId: DepartmentId || null,
      CreatedOn: new Date(),
      IsDeleted: false
    });

    res.status(201).json({ success: true, data: designation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update designation
exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { DesignationName, DepartmentId } = req.body;

    const designation = await Designation.findByPk(id);
    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }

    await designation.update({ DesignationName, DepartmentId });
    res.json({ success: true, data: designation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete designation (soft delete)
exports.deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await Designation.findByPk(id);

    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }

    await designation.update({ IsDeleted: true });
    res.json({ success: true, message: 'Designation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper methods for dropdowns
exports.selectDesignations = async () => {
  const designations = await Designation.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DesignationName']
  });
  return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};

exports.selectExpenseDesignations = async () => {
  // Similar to selectDesignations, might have different filtering
  const designations = await Designation.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DesignationName']
  });
  return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};
