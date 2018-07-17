function isAdminMiddleware(req, res, next) {
    // aexectue after auth middleware
    if (!req.user.isAdmin)
        // 401  - Unathorized - no token provided
        // 403 - Forbidden -  token is valid but no permissions
        return res.status(403).send('Access denied.');
    
        return next();
}

module.exports = isAdminMiddleware;