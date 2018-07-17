const winston = require('winston'); 

module.exports = (err, req, res, next) => {
    // err, warn, info, verbose, debug, silly - error levels
    winston.error(err.message, err);
    // console.error('Cannot connect', e);
    return res.status(500).send('Something failed');
};