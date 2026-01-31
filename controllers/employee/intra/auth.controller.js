
const jwt = require('jsonwebtoken');

// --- Business Logic (Merged) ---

const { Employee, Department, Designation } = require('../../../models/superAdmin');


require('dotenv').config();

const login = async (employeeId, password) => {
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

const verifyBirthYear = async (employeeDbId, year) => {
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

// -----------------------------


exports.login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        if (!employeeId || !password) {
            return res.status(400).json({ success: false, message: 'Employee ID and password are required' });
        }
        const result = await login(employeeId, password);
        res.json({ success: true, ...result });
    } catch (error) {
        // Distinguish between 401 and 500 if possible, but keeping it simple for now
        const status = error.message === 'Invalid credentials' || error.message === 'Employee not found' ? 401 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

exports.verifyBirthYear = async (req, res) => {
    try {
        const { birthYear } = req.body;
        if (!birthYear) {
            return res.status(400).json({ success: false, message: 'Birth year is required' });
        }

        // req.user is set by authMiddleware
        const isValid = await verifyBirthYear(req.user.id, birthYear);

        if (isValid) {
            res.json({ success: true, message: 'Birth year verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid birth year' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = async (req, res) => {
    // Client-side token clearing only needed for JWT usually.
    // But we return success msg.
    res.json({ success: true, message: 'Logged out successfully' });
};
