const morgan = require('morgan'); // http req logger

// checking env
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`); // development by default
module.exports = function(app, winston) {
    // export NODE_ENV=production || development (default value)
    if (app.get('env') == 'development') { // by default is development
        app.use(morgan('tiny')); // log http requests - good for dev / local env
        winston.debug('Morgan enabled!');
    } else {
        winston.info('Production !!!!!!!!')
    }
};