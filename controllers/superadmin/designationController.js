const designationService = require('../../services/superadmin/designationService');

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
  const response = { success, message, data, errors };
  if (pagination) response.pagination = pagination;
  res.json(response);
};

// Get all designations
exports.getAllDesignations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const search = req.query.search || '';

    const result = await designationService.getAllDesignations(page, limit, search);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Designations retrieved successfully', result.rows, null, pagination);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designations', null, { message: error.message });
  }
};

// Get designation by ID
exports.getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await designationService.getDesignationById(id);

    if (!designation) {
      return sendResponse(res, false, 'Designation not found');
    }

    sendResponse(res, true, 'Designation retrieved successfully', designation);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designation', null, { message: error.message });
  }
};

// Create designation
exports.createDesignation = async (req, res) => {
  try {
    const { DesignationName, DepartmentId, Category } = req.body;

    if (!DesignationName) {
      return sendResponse(res, false, 'Designation name is required');
    }

    if (DepartmentId) {
      const departmentService = require('../../services/superadmin/departmentService');
      const dept = await departmentService.getDepartmentById(DepartmentId);
      if (!dept) {
        return sendResponse(res, false, 'Department not found');
      }
    }

    const designation = await designationService.createDesignation({ DesignationName, DepartmentId, Category });
    res.status(201);
    sendResponse(res, true, 'Designation created successfully', designation);
  } catch (error) {
    sendResponse(res, false, 'Failed to create designation', null, { message: error.message });
  }
};

// Update designation
exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { DesignationName, DepartmentId, Category } = req.body;

    const designation = await designationService.getDesignationById(id);
    if (!designation) {
      return sendResponse(res, false, 'Designation not found');
    }

    if (DepartmentId) {
      const departmentService = require('../../services/superadmin/departmentService');
      const dept = await departmentService.getDepartmentById(DepartmentId);
      if (!dept) {
        return sendResponse(res, false, 'Department not found');
      }
    }

    const updatedDesignation = await designationService.updateDesignation(designation, { DesignationName, DepartmentId, Category });
    sendResponse(res, true, 'Designation updated successfully', updatedDesignation);
  } catch (error) {
    sendResponse(res, false, 'Failed to update designation', null, { message: error.message });
  }
};

// Delete designation (soft delete)
exports.deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await designationService.getDesignationById(id);

    if (!designation) {
      return sendResponse(res, false, 'Designation not found');
    }

    await designationService.deleteDesignation(designation);
    sendResponse(res, true, 'Designation deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete designation', null, { message: error.message });
  }
};

// Helper methods for dropdowns
exports.selectDesignations = async (req, res) => {
  try {
    const dropdown = await designationService.selectDesignations();
    sendResponse(res, true, 'Designations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designations dropdown', null, { message: error.message });
  }
};

exports.selectExpenseDesignations = async (req, res) => {
  try {
    const dropdown = await designationService.selectExpenseDesignations();
    sendResponse(res, true, 'Expense designations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve expense designations dropdown', null, { message: error.message });
  }
};
