module.exports = (req, res, next) => {
    // 1 = Admin, 2 = User, etc. Adjust based on your UserType logic
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. key Admin privileges required.' });
    }
};
