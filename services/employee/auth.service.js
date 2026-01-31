const db = require('../../models');
const { Employee, Department, Designation } = db;
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (employeeId, password) => {
    // Note: Checking Email and plain text password as per user request.
    const employee = await Employee.findOne({
        where: { Email: employeeId },
        include: [
            { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] },
            { model: Designation, as: 'designation', attributes: ['Id', 'DesignationName'] }
        ]
    });

    if (!employee) {
        throw new Error('Employee not found');
    }

    if (employee.Password !== password) {
        throw new Error('Invalid credentials');
    }

    // Generate Token
    const token = jwt.sign(
        { id: employee.Id, empId: employee.EmpId, name: employee.FirstName },
        process.env.JWT_SECRET || 'unicharm_secret_key',
        { expiresIn: '24h' }
    );

    const firstName = employee.FirstName || '';
    const lastName = employee.LastName || '';

    return {
        token,
        employee: {
            id: employee.EmpId, // ID used by frontend (EmpId string matches request login id)
            dbId: employee.Id, // Internal DB ID
            name: `${firstName} ${lastName}`.trim(),
            department: employee.department ? employee.department.DepartmentName : '',
            designation: employee.designation ? employee.designation.DesignationName : ''
        }
    };
};

exports.verifyBirthYear = async (employeeDbId, year) => {
    const employee = await Employee.findByPk(employeeDbId);
    if (!employee) throw new Error('Employee not found');

    if (!employee.Birthdate) throw new Error('Birth date not set for employee');

    const birthDate = new Date(employee.Birthdate);
    const birthYear = birthDate.getFullYear();

    // Strict comparison
    if (birthYear !== parseInt(year)) {
        return false;
    }
    return true;
};
