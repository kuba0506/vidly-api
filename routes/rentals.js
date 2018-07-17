const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const validateResource = require('../middleware/validator');
const { RentalClass, validation_schema } = require('../models/rental-model');
const { MovieClass } = require('../models/movie-model');
const { CustomerClass } = require('../models/customer-model');

// 2 phase commit  - validate transaction
Fawn.init(mongoose);

// Create rental, POST /api/rentals
router.post('/', (req, res) => {
    const response = (async () => {
        try {
            // check if rental is valid
            const { error } = validateResource(req.body, validation_schema);

            if (error)
                return res.status(400).send(error.details[0].message);

            // check if valid customer
            const customer = await CustomerClass.findById(req.body.customerId);
            if (!customer)
                return res.status(400).send('Invalid customer!');

            // check if valid movie
            const movie = await MovieClass.findById(req.body.movieId);
            if (!movie)
                return res.status(400).send('Invalid movie!');

            // check if moivie is available for rental
            if (movie.numberInStock === 0)
                return res.status(400).send('Movie not in stock!')

            let rental = new RentalClass({
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    isGold: customer.isGold,
                    phone: customer.phone
                },
                movie: {
                    _id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate
                },
                dateReturned: Date.now() + 10000,

            });

            try {
                // transaction - task object
                new Fawn.Task()
                    .save('rentals', rental)
                    .update('movies', { _id: movie._id }, {
                        $inc: { numberInStock: -1 }
                    })
                    .run();

                return res.send(rental);
            } catch (error) {
                console.error('Internal error');
                return res.status(500).send('Something failed.');
            }

            // movie.numberInStock--;
            // movie.save();

        } catch (e) {
            console.error('Cannot get data', e);
            return res.status(400).send('Bad request');
        }
    })();

    return response;
});

// Get all rentals, GET /api/rentals
router.get('/', (req, res) => {
    const response = (async () => {
        try {
            const rentals = await RentalClass.find().sort('-dateOut');

            return res.send(rentals);
        } catch (error) {
            console.error('Cannot get data', e);
            return res.status(400).send('Bad request');
        }
    })();

    return response;
});

// Get specific rental by id, GET /api/rentals/:id
router.get('/:id', (req, res) => {
    const response = (async () => {
        try {
            const rental = await RentalClass.findById(req.params.id);

            return res.send(rental);
        } catch (error) {
            console.error('Cannot get data', error);
            return res.status(404).send('Resource not found!');
        }
    })();

    return response;
});

// Update rental, PUT /api/rentals/:id
router.put('/:id', (req, res) => {
    const response = (async () => {
        try {
            const { error } = validateResource(req.body, validation_schema);

            if (error)
                return res.status(400).send(error.details[0].message);

            const rental = await RentalClass.findByIdAndUpdate(req.params.id,
                { dateOut: req.body.dateOut }, { new: true });

            return res.send(rental);
        } catch (error) {
            console.error('Cannot get data', error);
            return res.status(404).send('Resource not found!');
        }
    })();

    return response;
});


// Delete rental, DELETE /api.rentals/:id
router.delete('/:id', (req, res) => {
    const response = (async () => {
        try {
            const rental = await RentalClass.findByIdAndRemove(req.params.id);

            if (!rental)
                return res.status(404).send('Rental not found!');

            return res.send(rental)
        } catch (error) {
            console.error('Cannot get data', error);
            return res.status(404).send('Resource not found!');
        }
    })();

    return response;
});

module.exports = router;

