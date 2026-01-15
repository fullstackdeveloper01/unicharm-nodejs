const db = require('../models');
const { Employee, Department, Designation, Role, Unit, Zone, Location } = db;
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storedProcedureService = require('../services/storedProcedureService');

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

// Get all employees using stored procedure
exports.getAllEmployees = async (req, res) => {
  try {
    // Use stored procedure to get employees list
    const employees = await storedProcedureService.getEmployeesList();
    
    res.json({ success: true, data: employees });
  } catch (error) {
    // Fallback to Sequelize query if stored procedure fails
    try {
      const employees = await Employee.findAll({
        where: { IsDeleted: false },
        include: [
          { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] },
          { model: Designation, as: 'designation', attributes: ['Id', 'DesignationName'] },
          { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
        ],
        order: [['CreatedOn', 'DESC']]
      });

      const formattedEmployees = employees.map(emp => ({
        Id: emp.Id,
        Name: `${emp.FirstName} ${emp.LastName || ''}`.trim(),
        Email: emp.Email,
        Department: emp.department ? emp.department.DepartmentName : '',
        Designation: emp.designation ? emp.designation.DesignationName : '',
        UserPhoto: emp.UserPhoto || '/Images/Profile/user-avatar.jpg',
        IsDeleted: emp.IsDeleted
      }));

      res.json({ success: true, data: formattedEmployees });
    } catch (fallbackError) {
      res.status(500).json({ success: false, error: fallbackError.message });
    }
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id, {
      include: [
        { model: Department, as: 'department' },
        { model: Designation, as: 'designation' },
        { model: Role, as: 'role' },
        { model: Unit, as: 'unit' },
        { model: Zone, as: 'zone' },
        { model: Location, as: 'location' }
      ]
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const uploadMiddleware = upload.single('file');
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      try {
        const employeeData = req.body;
        let userPhoto = null;

        if (req.file) {
          userPhoto = `/uploads/employees/${req.file.filename}`;
        }

        const employee = await Employee.create({
          ...employeeData,
          UserPhoto: userPhoto,
          CreatedOn: new Date(),
          IsDeleted: false
        });

        res.status(201).json({ success: true, data: employee });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      try {
        const employee = await Employee.findByPk(id);
        if (!employee) {
          return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        const updateData = { ...req.body };

        if (req.file) {
          // Delete old image if exists
          if (employee.UserPhoto && fs.existsSync(employee.UserPhoto.replace('/', ''))) {
            fs.unlinkSync(employee.UserPhoto.replace('/', ''));
          }
          updateData.UserPhoto = `/uploads/employees/${req.file.filename}`;
        }

        await employee.update(updateData);
        res.json({ success: true, data: employee });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete employee (soft delete)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await employee.update({ IsDeleted: true });
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Soft delete toggle
exports.toggleSoftDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await employee.update({ IsDeleted: !employee.IsDeleted });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper methods for dropdowns
exports.selectDepartments = async () => {
  const departments = await Department.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DepartmentName']
  });
  return departments.map(dept => ({ value: dept.Id, text: dept.DepartmentName }));
};

exports.selectDesignations = async () => {
  const designations = await Designation.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DesignationName']
  });
  return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};

exports.selectRoles = async () => {
  const roles = await Role.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'RoleName']
  });
  return roles.map(role => ({ value: role.Id, text: role.RoleName }));
};

exports.selectEmployeesAsSupervisor = async () => {
  const employees = await Employee.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'FirstName', 'LastName', 'EmpId']
  });
  return employees.map(emp => ({
    value: emp.Id,
    text: `${emp.FirstName} ${emp.LastName || ''} (empid ${emp.EmpId || emp.Id})`.trim()
  }));
};

exports.selectEmployees = async () => {
  const employees = await Employee.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'FirstName', 'LastName', 'EmpId']
  });
  return employees.map(emp => ({
    value: emp.Id,
    text: `${emp.FirstName} ${emp.LastName || ''} (empid ${emp.EmpId || emp.Id})`.trim()
  }));
};

exports.selectUnits = async () => {
  const units = await Unit.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'UnitName']
  });
  return units.map(unit => ({ value: unit.Id, text: unit.UnitName }));
};

exports.selectZones = async () => {
  const zones = await Zone.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'ZoneName']
  });
  return zones.map(zone => ({ value: zone.Id, text: zone.ZoneName }));
};

exports.selectLocations = async () => {
  const locations = await Location.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'LocationName']
  });
  return locations.map(loc => ({ value: loc.Id, text: loc.LocationName }));
};

exports.selectUserCategory = async () => {
  // This would typically come from a lookup table or enum
  return [
    { value: 'Regular', text: 'Regular' },
    { value: 'Contract', text: 'Contract' },
    { value: 'Temporary', text: 'Temporary' }
  ];
};

exports.selectUserType = async () => {
  // This would typically come from a lookup table or enum
  return [
    { value: 'Admin', text: 'Admin' },
    { value: 'User', text: 'User' },
    { value: 'Manager', text: 'Manager' }
  ];
};

exports.selectTTMT = async () => {
  return [
    { value: 'TT', text: 'TT' },
    { value: 'MT', text: 'MT' }
  ];
};
