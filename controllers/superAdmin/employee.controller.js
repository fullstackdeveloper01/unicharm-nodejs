
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storedProcedureService = require('../../services/superAdmin/storedProcedure.service.js');
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Employee, Department, Designation, Role, Unit, Zone, Location } = require('../../models/superAdmin');



// Add this line to import Op

/**
 * Get all employees
 * @returns {Promise<Array>} List of employees
 */
const getAllEmployees = async (page = 1, limit = null, filters = {}) => {
  const pageNumber = parseInt(page) || 1;
  let limitNumber = parseInt(limit);
  if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

  const whereClause = {
    [Op.or]: [
      { IsDeleted: false },
      { IsDeleted: null },
      { IsDeleted: 0 }
    ]
  };

  // Apply filters if provided
  if (filters.departmentId) whereClause.DepartmentId = filters.departmentId;
  if (filters.designationId) whereClause.DesignationId = filters.designationId;
  if (filters.roleId) whereClause.RoleId = filters.roleId;
  if (filters.unitId) whereClause.Unit = filters.unitId;
  if (filters.zoneId) whereClause.Zone = filters.zoneId;
  if (filters.locationId) whereClause.Location = filters.locationId;

  // Add search functionality
  if (filters.search) {
    whereClause[Op.or] = [
      { FirstName: { [Op.like]: `%${filters.search}%` } },
      { LastName: { [Op.like]: `%${filters.search}%` } },
      { Email: { [Op.like]: `%${filters.search}%` } }
    ];
  }

  const queryOptions = {
    where: whereClause,
    include: [
      { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] },
      { model: Designation, as: 'designation', attributes: ['Id', 'DesignationName'] },
      { model: Role, as: 'role', attributes: ['Id', 'RoleName'] },
      { model: Unit, as: 'unitDetails', attributes: ['Id', 'Title'], required: false },
      { model: Zone, as: 'zoneDetails', attributes: ['Id', 'Title'], required: false },
      { model: Location, as: 'locationDetails', attributes: ['Id', 'LocationName'], required: false }
    ],
    order: [['CreatedOn', 'DESC']]
  };

  if (limitNumber) {
    queryOptions.limit = limitNumber;
    queryOptions.offset = (pageNumber - 1) * limitNumber;
  }

  const { count, rows } = await Employee.findAndCountAll(queryOptions);

  const mappedRows = rows.map(emp => ({
    Id: emp.Id,
    Name: `${emp.FirstName} ${emp.LastName || ''}`.trim(),
    FirstName: emp.FirstName,
    LastName: emp.LastName,
    EmpId: emp.EmpId,
    Email: emp.Email,
    Department: emp.department ? emp.department.DepartmentName : '',
    Designation: emp.designation ? emp.designation.DesignationName : '',
    Unit: emp.unitDetails ? emp.unitDetails.Title : (emp.Unit || ''),
    Zone: emp.zoneDetails ? emp.zoneDetails.Title : (emp.Zone || ''),
    Location: emp.locationDetails ? emp.locationDetails.LocationName : (emp.Location || ''),
    UserPhoto: emp.UserPhoto || '/Images/Profile/user-avatar.jpg',
    IsDeleted: emp.IsDeleted
  }));

  return { count, rows: mappedRows };
};

/**
 * Get employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise<Object>} Employee
 */
const getEmployeeById = async (id) => {
  return await Employee.findByPk(id, {
    include: [
      { model: Department, as: 'department' },
      { model: Designation, as: 'designation' },
      { model: Role, as: 'role' },

    ]
  });
};

/**
 * Create employee
 * @param {Object} data - Employee data
 * @returns {Promise<Object>} Created employee
 */
const createEmployee = async (data) => {
  return await Employee.create({
    ...data,
    CreatedOn: new Date(),
    IsDeleted: false
  });
};

/**
 * Update employee
 * @param {Object} employee - Employee instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated employee
 */
const updateEmployee = async (employee, data) => {
  // Handle photo deletion logic if needed here or keep in controller
  // Ideally business logic like removing old file should be here
  if (data.UserPhoto && employee.UserPhoto && data.UserPhoto !== employee.UserPhoto) {
    if (fs.existsSync(employee.UserPhoto.replace('/', ''))) {
      try {
        fs.unlinkSync(employee.UserPhoto.replace('/', ''));
      } catch (e) { console.error('Error deleting old photo', e); }
    }
  }
  return await employee.update(data);
};

/**
 * Delete employee (soft delete)
 * @param {Object} employee - Employee instance
 * @returns {Promise<Object>} Deleted employee
 */
const deleteEmployee = async (employee) => {
  return await employee.update({ IsDeleted: true });
};

/**
 * Toggle soft delete status
 * @param {Object} employee - Employee instance
 * @returns {Promise<Object>} Updated employee
 */
const toggleSoftDelete = async (employee) => {
  return await employee.update({ IsDeleted: !employee.IsDeleted });
};

// Dropdown helpers
const selectDepartments = async () => {
  const departments = await Department.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DepartmentName']
  });
  return departments.map(dept => ({ value: dept.Id, text: dept.DepartmentName }));
};

const selectDesignations = async () => {
  const designations = await Designation.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DesignationName']
  });
  return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};

const selectRoles = async () => {
  const roles = await Role.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'RoleName']
  });
  return roles.map(role => ({ value: role.Id, text: role.RoleName }));
};

const selectEmployeesAsSupervisor = async () => {
  const employees = await Employee.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'FirstName', 'LastName', 'EmpId']
  });
  return employees.map(emp => {
    const fullName = `${emp.FirstName} ${emp.LastName || ''}`.trim();
    return {
      value: emp.Id,
      text: fullName,
      label: fullName,
      Name: fullName,
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      EmpId: emp.EmpId
    };
  });
};

const selectEmployees = async () => {
  const employees = await Employee.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'FirstName', 'LastName', 'EmpId']
  });
  return employees.map(emp => {
    const firstName = emp.FirstName || emp.firstname || (emp.getDataValue ? emp.getDataValue('FirstName') : '') || '';
    const lastName = emp.LastName || emp.lastname || (emp.getDataValue ? emp.getDataValue('LastName') : '') || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return {
      value: emp.Id,
      text: fullName,
      label: fullName,
      Name: fullName,
      FirstName: firstName,
      LastName: lastName,
      EmpId: emp.EmpId
    };
  });
};

const selectUnits = async () => {
  const units = await Unit.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'Title']
  });
  return units.map(unit => ({ value: unit.Id, text: unit.Title, label: unit.Title }));
};

const selectZones = async () => {
  const zones = await Zone.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'Title']
  });
  return zones.map(zone => ({ value: zone.Id, text: zone.Title, label: zone.Title }));
};

const selectLocations = async () => {
  const locations = await Location.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'LocationName']
  });
  return locations.map(loc => ({ value: loc.Id, text: loc.LocationName, label: loc.LocationName }));
};

// -----------------------------

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

    const result = await getAllEmployees(page, limit, filters);

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
    const employee = await getEmployeeById(id);

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

        const employee = await createEmployee({
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
        const employee = await getEmployeeById(id);
        if (!employee) {
          return sendResponse(res, false, 'Employee not found');
        }

        const updateData = { ...req.body };

        if (req.file) {
          updateData.UserPhoto = `/uploads/employees/${req.file.filename}`;
        }

        const updatedEmployee = await updateEmployee(employee, updateData);
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
    const employee = await getEmployeeById(id);

    if (!employee) {
      return sendResponse(res, false, 'Employee not found');
    }

    await deleteEmployee(employee);
    sendResponse(res, true, 'Employee deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete employee', null, { message: error.message });
  }
};

// Soft delete toggle
exports.toggleSoftDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getEmployeeById(id);

    if (!employee) {
      return sendResponse(res, false, 'Employee not found');
    }

    const updatedEmployee = await toggleSoftDelete(employee);
    sendResponse(res, true, 'Employee status toggled successfully', updatedEmployee);
  } catch (error) {
    sendResponse(res, false, 'Failed to toggle employee status', null, { message: error.message });
  }
};

// Helper methods for dropdowns
exports.selectDepartments = async (req, res) => {
  try {
    const dropdown = await selectDepartments();
    sendResponse(res, true, 'Departments dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve departments dropdown', null, { message: error.message });
  }
};

exports.selectDesignations = async (req, res) => {
  try {
    const dropdown = await selectDesignations();
    sendResponse(res, true, 'Designations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designations dropdown', null, { message: error.message });
  }
};

exports.selectRoles = async (req, res) => {
  try {
    const dropdown = await selectRoles();
    sendResponse(res, true, 'Roles dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve roles dropdown', null, { message: error.message });
  }
};

exports.selectEmployeesAsSupervisor = async (req, res) => {
  try {
    const dropdown = await selectEmployeesAsSupervisor();
    sendResponse(res, true, 'Supervisors dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve supervisors dropdown', null, { message: error.message });
  }
};

exports.selectEmployees = async (req, res) => {
  try {
    const dropdown = await selectEmployees();
    sendResponse(res, true, 'Employees dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve employees dropdown', null, { message: error.message });
  }
};

exports.selectUnits = async (req, res) => {
  try {
    const dropdown = await selectUnits();
    sendResponse(res, true, 'Units dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve units dropdown', null, { message: error.message });
  }
};

exports.selectZones = async (req, res) => {
  try {
    const dropdown = await selectZones();
    sendResponse(res, true, 'Zones dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve zones dropdown', null, { message: error.message });
  }
};

exports.selectLocations = async (req, res) => {
  try {
    const dropdown = await selectLocations();
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


