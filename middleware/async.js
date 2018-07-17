const winston = require('winston'); 

function asyncMiddleware(routeHandler) {
    return async function (req, res, next) {
        try {
            await routeHandler(req, res);
        } catch (error) {
            winston.error(error.message, error);
            next(error);
        }
    };
}

module.exports = asyncMiddleware;