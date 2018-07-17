const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

PasswordComplexity.userPassword = {
    min: 5,
    max: 1024,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
};

// Joi
const validation_schema = Joi.object().keys({
    name: Joi.string().trim().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().required()
});

// Mongoose 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});
// encapsulate logic in mongoose model
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwt-private-key'));
};
const UserClass = mongoose.model('User', userSchema);

module.exports.validation_schema = validation_schema;
module.exports.UserClass = UserClass;