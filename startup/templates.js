module.exports = function(app) {
    // View-engine setup
    app.set('view engine', 'pug');
    app.set('views', './public/views'); // default ./views
};