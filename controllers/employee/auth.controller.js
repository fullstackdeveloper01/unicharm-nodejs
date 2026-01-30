const authService = require('../../services/employee/auth.service');

exports.login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        if (!employeeId || !password) {
            return res.status(400).json({ success: false, message: 'Employee ID and password are required' });
        }
        const result = await authService.login(employeeId, password);
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
        const isValid = await authService.verifyBirthYear(req.user.id, birthYear);

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
