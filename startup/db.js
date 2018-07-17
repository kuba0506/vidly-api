const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
    // connect to db once at app init
    mongoose.connect('mongodb://localhost/vidly')
        .then(() => winston.info('Connected to MongoDB...'))
        // error is supported by global error handler 
};