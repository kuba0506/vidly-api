const express = require('express');
const validateResource = require('../middleware/validator');
const router = express.Router();
const { MovieClass, validation_schema } = require('../models/movie-model');
const { GenreClass } = require('../models/genre-mode');

// Get all
router.get('/', (req, res) => {
    const response = (async () => {
        try {
            return res.send(await MovieClass.find().sort('title'));
        } catch (e) {
            console.error('Cannot get data', e);
            return res.status(404).send('Resource not found! - 1');
        }
    })();

    return response;
});

// Get specific movie
router.get('/:id', (req, res) => {
    const response = (async () => {
        try {
            const movie = await MovieClass.findById(req.params.id);

            return res.send(movie);
        } catch (e) {
            console.error('Cannot get data', e);
            return res.status(404).send('Resource not found!');
        }
    })();

    return response;
});

// Create a new movie
router.post('/', (req, res) => {
    const response = (async () => {
        try {
            // check if course is valid
            const { error } = validateResource(req.body, validation_schema);

            // if fails 400 Bad request
            if (error)
                return res.status(400).send(error.details[0].message);

            const genre = await GenreClass.findById(req.body.genreId);
            if (!genre)
                return res.status(400).send('Invalid genre!');

            // create new genre
            const movie = await new MovieClass({
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }).save();

            // send genre
            return res.status(201).send(movie);

        } catch (e) {
            console.error('Cannot get data', e);
            return res.status(400).send('Bad request');
        }
    })();

    return response;
});

// Update specific movie
router.put('/:id', (req, res) => {
    const response = (async () => {
        try {
            const { error } = validateResource(req.body, validation_schema);

            if (error)
                return res.status(400).send(error.details[0].message);

            const movie = await MovieClass.findByIdAndUpdate(req.params.id,
                { title: req.body.title },
                { new: true });

            return res.send(movie);
        } catch (e) {
            console.error('Cannot get data', e);
            return res.status(404).send('Resource not found!');
        }
    })();

    return response;
});

// Delete specific movie
router.delete('/:id', (req, res) => {
    const response = (async () => {
        try {
            const movie = await MovieClass.findByIdAndRemove(req.params.id);

            // if not 404
            if (!movie)
                return res.status(404).send('Not found! - 1');

            return res.send(movie);
        } catch(e) {
            console.error('Cannot get data', e);
            return res.status(404).send('Resource not found!');
        }
    })();

    return response;
});


module.exports = router;

