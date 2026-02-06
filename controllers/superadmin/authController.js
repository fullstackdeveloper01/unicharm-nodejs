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

        // Generate initials
        const firstInitial = user.FirstName ? user.FirstName.charAt(0).toUpperCase() : '';
        const lastInitial = user.LastName ? user.LastName.charAt(0).toUpperCase() : '';
        const initials = `${firstInitial}${lastInitial}` || 'U';

        // Process profile image
        let profileImage = user.UserPhoto;
        if (profileImage && !profileImage.startsWith('http')) {
            const localBaseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
            const liveBaseUrl = process.env.LIVE_BASE_URL || 'http://103.39.133.42';

            if (!profileImage.startsWith('/') && !profileImage.includes('/')) {
                if (profileImage.startsWith('profile-')) {
                    // New uploads - use local/current server
                    profileImage = `${localBaseUrl}/uploads/profile/${profileImage}`;
                } else {
                    // Legacy images - use live database server
                    profileImage = `${liveBaseUrl}/Images/Profile/${profileImage}`;
                }
            } else {
                // Has path already - determine which base URL to use
                if (profileImage.includes('/Images/')) {
                    profileImage = `${liveBaseUrl}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`;
                } else {
                    profileImage = `${localBaseUrl}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`;
                }
            }
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
                    firstName: user.FirstName || '',
                    lastName: user.LastName || '',
                    email: userEmail,
                    isAdmin: isAdmin,
                    profileImage: profileImage || null,
                    initials: initials,
                    designation: user.DesignationId,
                    department: user.DepartmentId
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        console.log(`Forgot password request for: ${cleanEmail}`);

        // Find user by email
        const user = await Employee.findOne({
            where: {
                [Op.or]: [
                    { Email: cleanEmail },
                    { UserName: cleanEmail }
                ],
                [Op.or]: [
                    { IsDeleted: false },
                    { IsDeleted: null },
                    { IsDeleted: 0 }
                ]
            }
        });

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If your email is registered, you will receive password reset instructions.'
            });
        }

        // Generate a temporary password (6 digit)
        const tempPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Update user password with temporary password
        await user.update({ Password: tempPassword });

        // Try to send email (if email config exists)
        try {
            const nodemailer = require('nodemailer');

            // Check if email configuration exists
            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.SMTP_FROM || process.env.SMTP_USER,
                    to: user.Email,
                    subject: 'Password Reset - Unicharm EMS',
                    html: `
                        <h2>Password Reset</h2>
                        <p>Hello ${user.FirstName || 'User'},</p>
                        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
                        <p>Please login and change your password immediately.</p>
                        <br>
                        <p>Regards,<br>Unicharm EMS Team</p>
                    `
                });

                console.log(`Password reset email sent to: ${user.Email}`);
            } else {
                console.log(`SMTP not configured. Temp password for ${user.Email}: ${tempPassword}`);
            }
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            // Continue even if email fails - password is still reset
        }

        res.json({
            success: true,
            message: 'If your email is registered, you will receive password reset instructions.',
            // For development/testing only - remove in production
            ...(process.env.NODE_ENV === 'development' && { tempPassword })
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
    }
};
