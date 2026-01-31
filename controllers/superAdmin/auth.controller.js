const storedProcedureService = require('../../services/superAdmin/storedProcedure.service.js');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password, type } = req.body; // type: 'employee' or 'accountant'

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        let user = null;
        let isAdmin = false;

        console.log('Login Request Body:', req.body);
        console.log(`Attempting login for: ${email} with password: ${password}`);

        // Always authenticate against Employee table as per requirement
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        console.log(`Authenticating ${email} against Employee table`);
        const result = await storedProcedureService.checkLogin(email, password);
        console.log('SP CheckLogin Result:', JSON.stringify(result, null, 2));

        if (!result || (Array.isArray(result) && result.length === 0)) {
            console.log('Login failed: No result from SP');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        user = Array.isArray(result) ? result[0] : result;
        // Employees might not have IsAdmin flag directly or it works differently.
        isAdmin = false;

        // Ensure user is an object, not an array (handle potential nested results from SP)
        while (Array.isArray(user)) {
            if (user.length === 0) {
                user = null;
                break;
            }
            user = user[0];
        }

        if (!user || (typeof user === 'object' && Object.keys(user).length === 0)) {
            // Should verify credentials logic earlier caught this, but just in case
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Handle case where user object is wrapped in '0' key (Sequelize/Driver specific artifact)
        if (user && user['0'] && (user['0'].Id || user['0'].AccountantId)) {
            user = user['0'];
        }

        console.log('Login User Data:', user);

        // Helper to safely get property (case-insensitive)
        const getProp = (obj, prop) => {
            if (!obj) return undefined;
            if (obj[prop] !== undefined) return obj[prop];
            // Try lowercase
            const lowerProp = prop.toLowerCase();
            for (const key in obj) {
                if (key.toLowerCase() === lowerProp) return obj[key];
            }
            return undefined;
        };

        const userId = getProp(user, 'Id') || getProp(user, 'AccountantId');
        const userEmail = getProp(user, 'Email') || getProp(user, 'UserName');
        const firstName = getProp(user, 'FirstName') || '';
        const lastName = getProp(user, 'LastName') || '';
        const fullName = getProp(user, 'FullName');

        const displayName = fullName || (firstName + ' ' + lastName).trim() || 'User';

        // Create token
        const token = jwt.sign(
            {
                id: userId,
                email: userEmail,
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
                    id: userId,
                    name: displayName,
                    email: userEmail || '',
                    isAdmin: isAdmin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};
