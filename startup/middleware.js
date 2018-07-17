const express = require('express');
const helmet = require('helmet');
const errorMiddleware = require('../middleware/error');
const authenticate_Middleware = require('../middleware/authenticate');
const logging_Middleware = require('../middleware/logger');

module.exports = function(app) {
    // Middlware
    app.use(express.json()); // req.body
    app.use(express.urlencoded({ extended: true })); // key=value&key2=value form POST => req.body 
    app.use(express.static('public'));
    // 3rd party
    app.use(helmet()); // set-up various headers
    // Custom
    app.use(errorMiddleware);
    app.use(logging_Middleware);
    app.use(authenticate_Middleware);
};