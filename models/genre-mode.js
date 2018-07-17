const mongoose = require('mongoose');
const Joi = require('joi');

const validation_schema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required()
});

const genre_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    }
});

const GenreClass = mongoose.model('Genre', genre_schema);

module.exports.GenreClass = GenreClass;
module.exports.genre_schema = genre_schema;
module.exports.validation_schema = validation_schema;