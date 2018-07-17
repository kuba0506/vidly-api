module.exports = (req, res, next) => {
    console.log('Authenticating...');
    console.log('Done.');
    next();
};