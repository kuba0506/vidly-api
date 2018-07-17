const express = require('express');
const app = express();
const winston = require('winston'); 

// SETUP ENVIRNOMENT
require('./startup/env')(app, winston);

// SETUP LOGGING
require('./startup/logging')(app, winston);

// SETUP VALIDATION
require('./startup/validation')();

// SETUP TEMPLATE ENGINE
require('./startup/templates')(app);

// SETUP ROUTES
require('./startup/routes')(app);

// SETUP DATABASE
require('./startup/db')();

// SETUP CONFIG
require('./startup/config')();

// export PORT=3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    winston.info(`Server is listening on port ${port}`);
});

