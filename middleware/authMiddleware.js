const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token.' });
    }
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
