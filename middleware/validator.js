const Joi = require('joi');

module.exports = (resource, schema) => {
    return Joi.validate(resource, schema);
};