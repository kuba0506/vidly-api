const mongoose = require('mongoose');
const Joi = require('joi');

const CustomerClass = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    phone: {
        type: Number,
        min: 1,
        max: 999999999
    }
}));

const validation_schema = Joi.object().keys({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.number().integer().positive().min(1).max(999999999)
});

module.exports.CustomerClass = CustomerClass;
module.exports.validation_schema = validation_schema;