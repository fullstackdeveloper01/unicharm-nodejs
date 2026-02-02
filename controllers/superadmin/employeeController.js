const employeeService = require('../services/employeeService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/employees/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'employee-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Helper for standard response
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

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Filters
    const filters = {
      departmentId: req.query.departmentId ? parseInt(req.query.departmentId) : null,
      designationId: req.query.designationId ? parseInt(req.query.designationId) : null,
      roleId: req.query.roleId ? parseInt(req.query.roleId) : null,
      unitId: req.query.unitId ? parseInt(req.query.unitId) : null,
      zoneId: req.query.zoneId ? parseInt(req.query.zoneId) : null,
      locationId: req.query.locationId ? parseInt(req.query.locationId) : null,
      search: req.query.search || ''
    };

    const result = await employeeService.getAllEmployees(page, limit, filters);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Employees retrieved successfully', result.rows, null, pagination);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve employees', null, { message: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);

    if (!employee) {
      return sendResponse(res, false, 'Employee not found');
    }

    sendResponse(res, true, 'Employee retrieved successfully', employee);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve employee', null, { message: error.message });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return sendResponse(res, false, 'File upload failed', null, { message: err.message });
      }

      try {
        const employeeData = req.body;
        let userPhoto = null;

        if (req.file) {
          userPhoto = `/uploads/employees/${req.file.filename}`;
        }

        const employee = await employeeService.createEmployee({
          ...employeeData,
          UserPhoto: userPhoto
        });

        res.status(201);
        sendResponse(res, true, 'Employee created successfully', employee);
      } catch (error) {
        sendResponse(res, false, 'Failed to create employee', null, { message: error.message });
      }
    });
  } catch (error) {
    sendResponse(res, false, 'Failed to process request', null, { message: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return sendResponse(res, false, 'File upload failed', null, { message: err.message });
      }

      try {
        const employee = await employeeService.getEmployeeById(id);
        if (!employee) {
          return sendResponse(res, false, 'Employee not found');
        }

        const updateData = { ...req.body };

        if (req.file) {
          updateData.UserPhoto = `/uploads/employees/${req.file.filename}`;
        }

        const updatedEmployee = await employeeService.updateEmployee(employee, updateData);
        sendResponse(res, true, 'Employee updated successfully', updatedEmployee);
      } catch (error) {
        sendResponse(res, false, 'Failed to update employee', null, { message: error.message });
      }
    });
  } catch (error) {
    sendResponse(res, false, 'Failed to process request', null, { message: error.message });
  }
};

// Delete employee (soft delete)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);

    if (!employee) {
      return sendResponse(res, false, 'Employee not found');
    }

    await employeeService.deleteEmployee(employee);
    sendResponse(res, true, 'Employee deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete employee', null, { message: error.message });
  }
};

// Soft delete toggle
exports.toggleSoftDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);

    if (!employee) {
      return sendResponse(res, false, 'Employee not found');
    }

    const updatedEmployee = await employeeService.toggleSoftDelete(employee);
    sendResponse(res, true, 'Employee status toggled successfully', updatedEmployee);
  } catch (error) {
    sendResponse(res, false, 'Failed to toggle employee status', null, { message: error.message });
  }
};

// Helper methods for dropdowns
exports.selectDepartments = async (req, res) => {
  try {
    const dropdown = await employeeService.selectDepartments();
    sendResponse(res, true, 'Departments dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve departments dropdown', null, { message: error.message });
  }
};

exports.selectDesignations = async (req, res) => {
  try {
    const dropdown = await employeeService.selectDesignations();
    sendResponse(res, true, 'Designations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designations dropdown', null, { message: error.message });
  }
};

exports.selectRoles = async (req, res) => {
  try {
    const dropdown = await employeeService.selectRoles();
    sendResponse(res, true, 'Roles dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve roles dropdown', null, { message: error.message });
  }
};

exports.selectEmployeesAsSupervisor = async (req, res) => {
  try {
    const dropdown = await employeeService.selectEmployeesAsSupervisor();
    sendResponse(res, true, 'Supervisors dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve supervisors dropdown', null, { message: error.message });
  }
};

exports.selectEmployees = async (req, res) => {
  try {
    const dropdown = await employeeService.selectEmployees();
    sendResponse(res, true, 'Employees dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve employees dropdown', null, { message: error.message });
  }
};

exports.selectUnits = async (req, res) => {
  try {
    const dropdown = await employeeService.selectUnits();
    sendResponse(res, true, 'Units dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve units dropdown', null, { message: error.message });
  }
};

exports.selectZones = async (req, res) => {
  try {
    const dropdown = await employeeService.selectZones();
    sendResponse(res, true, 'Zones dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve zones dropdown', null, { message: error.message });
  }
};

exports.selectLocations = async (req, res) => {
  try {
    const dropdown = await employeeService.selectLocations();
    sendResponse(res, true, 'Locations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve locations dropdown', null, { message: error.message });
  }
};

exports.selectUserCategory = async (req, res) => {
  try {
    const categories = [
      { value: 'Regular', text: 'Regular' },
      { value: 'Contract', text: 'Contract' },
      { value: 'Temporary', text: 'Temporary' }
    ];
    sendResponse(res, true, 'User categories dropdown retrieved successfully', categories);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve user categories dropdown', null, { message: error.message });
  }
};

exports.selectUserType = async (req, res) => {
  try {
    const types = [
      { value: 'Admin', text: 'Admin' },
      { value: 'User', text: 'User' },
      { value: 'Manager', text: 'Manager' }
    ];
    sendResponse(res, true, 'User types dropdown retrieved successfully', types);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve user types dropdown', null, { message: error.message });
  }
};

exports.selectTTMT = async (req, res) => {
  try {
    const ttmt = [
      { value: 'TT', text: 'TT' },
      { value: 'MT', text: 'MT' }
    ];
    sendResponse(res, true, 'TT/MT dropdown retrieved successfully', ttmt);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve TT/MT dropdown', null, { message: error.message });
  }
};


