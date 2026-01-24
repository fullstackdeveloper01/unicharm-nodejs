const db = require('../models');
const { Employee, Department, Designation, Role, Unit, Zone, Location } = db;
const storedProcedureService = require('./storedProcedureService');
const fs = require('fs');

/**
 * Get all employees
 * @returns {Promise<Array>} List of employees
 */
exports.getAllEmployees = async () => {
    try {
        const result = await storedProcedureService.getEmployeesList();

        // Map stored procedure result to match the format expected by frontend
        // Assuming SP returns raw columns like FirstName, LastName, etc.
        return result.map(emp => ({
            Id: emp.Id || emp.id,
            Name: `${emp.FirstName || emp.firstname} ${emp.LastName || emp.lastname || ''}`.trim(),
            FirstName: emp.FirstName || emp.firstname,
            LastName: emp.LastName || emp.lastname,
            EmpId: emp.EmpId || emp.empid || emp.EmpID,
            Email: emp.Email || emp.email,
            Department: emp.DepartmentName || emp.departmentname || (emp.department ? emp.department.DepartmentName : ''),
            Designation: emp.DesignationName || emp.designationname || (emp.designation ? emp.designation.DesignationName : ''),
            UserPhoto: emp.UserPhoto || '/Images/Profile/user-avatar.jpg',
            IsDeleted: emp.IsDeleted
        }));
    } catch (error) {
        // Fallback to Sequelize query
        const employees = await Employee.findAll({
            where: { IsDeleted: false },
            include: [
                { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] },
                { model: Designation, as: 'designation', attributes: ['Id', 'DesignationName'] },
                { model: Role, as: 'role', attributes: ['Id', 'RoleName'] }
            ],
            order: [['CreatedOn', 'DESC']]
        });

        return employees.map(emp => ({
            Id: emp.Id,
            Name: `${emp.FirstName} ${emp.LastName || ''}`.trim(),
            FirstName: emp.FirstName,
            LastName: emp.LastName,
            EmpId: emp.EmpId,
            Email: emp.Email,
            Department: emp.department ? emp.department.DepartmentName : '',
            Designation: emp.designation ? emp.designation.DesignationName : '',
            UserPhoto: emp.UserPhoto || '/Images/Profile/user-avatar.jpg',
            IsDeleted: emp.IsDeleted
        }));
    }
};

/**
 * Get employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise<Object>} Employee
 */
exports.getEmployeeById = async (id) => {
    return await Employee.findByPk(id, {
        include: [
            { model: Department, as: 'department' },
            { model: Designation, as: 'designation' },
            { model: Role, as: 'role' },
            { model: Unit, as: 'unit' },
            { model: Zone, as: 'zone' },
            { model: Location, as: 'location' }
        ]
    });
};

/**
 * Create employee
 * @param {Object} data - Employee data
 * @returns {Promise<Object>} Created employee
 */
exports.createEmployee = async (data) => {
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
exports.updateEmployee = async (employee, data) => {
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
exports.deleteEmployee = async (employee) => {
    return await employee.update({ IsDeleted: true });
};

/**
 * Toggle soft delete status
 * @param {Object} employee - Employee instance
 * @returns {Promise<Object>} Updated employee
 */
exports.toggleSoftDelete = async (employee) => {
    return await employee.update({ IsDeleted: !employee.IsDeleted });
};

// Dropdown helpers
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

exports.selectEmployees = async () => {
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

exports.selectUnits = async () => {
    const units = await Unit.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'UnitName']
    });
    return units.map(unit => ({ value: unit.Id, text: unit.UnitName, label: unit.UnitName }));
};

exports.selectZones = async () => {
    const zones = await Zone.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'ZoneName']
    });
    return zones.map(zone => ({ value: zone.Id, text: zone.ZoneName, label: zone.ZoneName }));
};

exports.selectLocations = async () => {
    const locations = await Location.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'LocationName']
    });
    return locations.map(loc => ({ value: loc.Id, text: loc.LocationName, label: loc.LocationName }));
};
