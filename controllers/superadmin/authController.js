const db = require('../../models');
const { Employee } = db;
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const cleanEmail = email ? email.trim() : '';
        const cleanPassword = password ? password.trim() : '';

        if (!cleanEmail || !cleanPassword) {
            return res.status(400).json({ success: false, message: 'Email and Password are required' });
        }

        console.log(`Attempting login for: ${cleanEmail}`);

        // Direct DB Query
        const user = await Employee.findOne({
            where: {
                [Op.or]: [
                    { Email: cleanEmail },
                    { UserName: cleanEmail }
                ],
                Password: cleanPassword,
                [Op.or]: [
                    { IsDeleted: false },
                    { IsDeleted: null },
                    { IsDeleted: 0 }
                ]
            },
            raw: true
        });

        if (!user) {
            console.log('Login failed: Invalid credentials');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log('Login User Data:', user);

        // Display Name Logic
        let displayName = 'User';
        if (user.FirstName || user.LastName) {
            displayName = `${user.FirstName || ''} ${user.LastName || ''}`.trim();
        } else if (user.UserName) {
            displayName = user.UserName;
        }

        const userId = user.Id;
        const userEmail = user.Email || user.UserName;
        const isAdmin = false;

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
                    email: userEmail,
                    isAdmin: isAdmin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};
