const config = require('config');

// Configuration
// all secret data like password store as env variables, export app_password=1234
// console.log(`Application name: ${config.get('name')}`);
// console.log(`Mail server: ${config.get('mail.host')}`);
// console.log(`Mail password: ${config.get('mail.password')}`); // read from env variable
// db_debugger('Db connected!');

module.exports = function() {
    // check if jwt env variable is set
    if (!config.get('jwt-private-key')) {
        // this will be caught by winston and save in log, throw object allows
        // to examine stack trace
        throw new Error('FATAL ERROR: jwt-private-key is not defined');
    }
};