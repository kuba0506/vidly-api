const winstonDB = require('winston-mongodb'); // MongoDB logger

// DEBUG=app:db nodemon index.js - shortcuit to set env variable and run program
// debug can be set with env like export DEBUG=app:startup
// const debug = require('debug')('app:startup');
// const db_debugger = require('debug')('app:db');

module.exports = function(app, winston) {
    // log uncaught errors to different file, terminate process
    if (app.get('env') == 'development') {
        winston.handleExceptions(
            new winston.transports.Console({ colorize: true, prettyPrint: true }),
            new winston.transports.File({ filename: 'uncaughtExceptions.log' })
        );
    } else {
        winston.handleExceptions(
            new winston.transports.File({ filename: 'uncaughtExceptions.log' })
        );
    }
    
    // sync uncaught error
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        setTimeout(() => {
            process.exit(1); // 0 means success , anything else failure // fails to write in log
        }, 2000);
    });
    
    // async uncaught error
    process.on('unhandledRejection', (ex) => {
        // winston.error(ex.message, ex);
        // process.exit(1);
        throw ex; // to catch by winston.handleException
    });
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly', level: 'error' });
};