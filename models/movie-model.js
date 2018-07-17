const mongoose = require('mongoose');
const Joi = require('joi');
const { genre_schema, GenreClass } = require('./genre-mode');

// Joi
const validation_schema = Joi.object().keys({
    title: Joi.string().min(3).max(255).required(),
    // genre: {
    //     name: Joi.string().required()
    // },
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
});

// Mongoose
const MovieClass = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true
    },
    genre: {
        type: genre_schema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    }
}));

module.exports.validation_schema = validation_schema;
module.exports.MovieClass = MovieClass;