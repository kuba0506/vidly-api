const jwt = require('jsonwebtoken');
const config = require('config');

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Access denied. No token provided.');
    
        try {
            // throws an error when invalid
            const decodedPayload = jwt.verify(token, config.get('jwt-private-key'));

            req.user = decodedPayload;
            next();
        } catch (error) {
            // bad data, invalid
            return res.status(400).send('Invalid token');
        }
}

module.exports = authMiddleware;