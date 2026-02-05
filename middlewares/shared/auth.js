const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Bypass token check for OPTIONS requests (Preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers['authorization'] || req.header('Authorization');

    if (!authHeader) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1] || authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'unicharm_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    // 1 = Admin, 2 = User, etc. Adjust based on your UserType logic
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};
