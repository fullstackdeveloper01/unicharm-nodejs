const jwt = require('jsonwebtoken');

/**
 * Base token verification - extracts and verifies JWT token
 * This is the common logic shared across all portals
 */
const verifyTokenBase = (req, res) => {
    const authHeader = req.headers['authorization'] || req.header('Authorization');

    if (!authHeader) {
        return { success: false, message: 'Access denied. No token provided.' };
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7, authHeader.length)
        : authHeader;

    if (!token) {
        return { success: false, message: 'Access denied. No token provided.' };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        return { success: true, user: decoded };
    } catch (error) {
        return { success: false, message: 'Invalid token.', error: error.message };
    }
};

/**
 * Auditor Portal Middleware - Requires Auditor role
 */
const verifyToken = (req, res, next) => {
    const result = verifyTokenBase(req, res);

    if (!result.success) {
        return res.status(401).json({ success: false, message: result.message });
    }

    req.user = result.user;

    // Auditor specific authorization check
    if (req.user.Role === 'Auditor' || req.user.UserType === 'Auditor') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Auditor privileges required.'
        });
    }
};

module.exports = { verifyToken };
