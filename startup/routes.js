const express = require('express');

// IMPORT ROUTES
const genres_routes = require('../routes/genres');
const home_routes = require('../routes/home');
const customers_routes = require('../routes/customers');
const movie_routes = require('../routes/movies');
const rental_routes = require('../routes/rentals');
const user_routes = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function (app) {
    // SETUP MIDDLEWARE
    require('./middleware')(app);

    // ROUTES
    app.use('/api/genres', genres_routes); // routes
    app.use('/api/customers', customers_routes); // routes
    app.use('/api/movies', movie_routes); // routes
    app.use('/api/rentals', rental_routes); // routes
    app.use('/api/users', user_routes); // routes
    app.use('/api/auth', auth); // routes
    app.use('/', home_routes); // routes
 };