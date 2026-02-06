const departmentService = require('../../services/superadmin/departmentService');

// Helper for standard response (could be shared, but copying for now to keep it self-contained as per instructions)
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
  const response = {
    success,
    message,
    data,
    errors
  };

  if (pagination) {
    response.pagination = pagination;
  }

  res.json(response);
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const search = req.query.search || '';

    const result = await departmentService.getAllDepartments(page, limit, search);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Departments retrieved successfully', result.rows, null, pagination);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve departments', null, { message: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id);

    if (!department) {
      return sendResponse(res, false, 'Department not found');
    }

    sendResponse(res, true, 'Department retrieved successfully', department);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve department', null, { message: error.message });
  }
};

// Create department
// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { DepartmentName, CostCenter, Category } = req.body;

    if (!DepartmentName) {
      return sendResponse(res, false, 'Department name is required');
    }

    const department = await departmentService.createDepartment({ DepartmentName, CostCenter, Category });
    res.status(201);
    sendResponse(res, true, 'Department created successfully', department);
  } catch (error) {
    sendResponse(res, false, 'Failed to create department', null, { message: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { DepartmentName, CostCenter, Category } = req.body;

    console.log(`Updating department ${id} with:`, { DepartmentName, CostCenter, Category });

    const department = await departmentService.getDepartmentById(id);
    if (!department) {
      return sendResponse(res, false, 'Department not found');
    }

    const updatedDepartment = await departmentService.updateDepartment(department, { DepartmentName, CostCenter, Category });
    sendResponse(res, true, 'Department updated successfully', updatedDepartment);
  } catch (error) {
    sendResponse(res, false, 'Failed to update department', null, { message: error.message });
  }
};

// Delete department (soft delete)
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id);

    if (!department) {
      return sendResponse(res, false, 'Department not found');
    }

    await departmentService.deleteDepartment(department);
    sendResponse(res, true, 'Department deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete department', null, { message: error.message });
  }
};

// Helper method for dropdown
exports.selectDepartments = async (req, res) => {
  try {
    const dropdown = await departmentService.selectDepartments();
    sendResponse(res, true, 'Departments dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve departments dropdown', null, { message: error.message });
  }
};
