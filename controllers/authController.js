const storedProcedureService = require('../services/storedProcedureService');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password, type } = req.body; // type: 'employee' or 'accountant'

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        let user = null;
        let isAdmin = false;

        if (type === 'accountant') {
            if (!email) { // accountant uses username usually, but mapping from frontend might be email field
                return res.status(400).json({ success: false, message: 'Username/Email is required' });
            }
            // Assuming 'email' field contains username for accountant login
            const result = await storedProcedureService.checkLoginAccountant(email, password);
            // SP returns array, or object inside array? executeStoredProcedure returns first result set
            // checkLoginAccountant returns { AccountantId, FirstName, ..., IsAdmin, etc }

            // If result is empty or null
            if (!result || (Array.isArray(result) && result.length === 0)) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            user = Array.isArray(result) ? result[0] : result;
            // Map IsAdmin. Assuming database returns IsAdmin as boolean or 1/0
            isAdmin = user.IsAdmin === true || user.IsAdmin === 1;

        } else {
            // Default employee login
            if (!email) {
                return res.status(400).json({ success: false, message: 'Email is required' });
            }
            const result = await storedProcedureService.checkLogin(email, password);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            user = Array.isArray(result) ? result[0] : result;
            // Employees might not have IsAdmin flag directly or it works differently.
            // Adjust logic if needed. For now assuming employees are regular users unless specified
            isAdmin = false;
        }

        // Create token
        const token = jwt.sign(
            {
                id: user.Id || user.AccountantId,
                email: user.Email || user.UserName, // Accountant might not have email
                isAdmin: isAdmin
            },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.Id || user.AccountantId,
                    name: user.FullName || (user.FirstName + ' ' + (user.LastName || '')).trim(),
                    email: user.Email || '',
                    isAdmin: isAdmin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};
