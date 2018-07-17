const express = require('express');
const validateResource = require('../middleware/validator');
const authMiddleware = require('../middleware/auth');
const isAdminMiddleware = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();
const { validation_schema, GenreClass } = require('../models/genre-mode');

// Get all 
router.get('/', asyncMiddleware(async (req, res, next) => {
    // throw new Error('Could not get genres!');
    const genres = await GenreClass.find().sort('name');
    
    return res.send(genres);
}));

// router.get('/', async (req, res) => {
//     const genres = await GenreClass.find().sort('name');

//     return res.send(genres);
// });

// Get specific genre
router.get('/:id', asyncMiddleware(async (req, res, next) => {
    const genre = await GenreClass.findById(req.params.id);

    // if fails send 404 not found
    if (!genre)
        return res.status(404).send('Resource not found!');

    return res.send(genre);
}));
// router.get('/:id', async (req, res) => {
//     const genre = await GenreClass.findById(req.params.id);

//     // if fails send 404 not found
//     if (!genre)
//         return res.status(404).send('Resource not found!');

//     return res.send(genre);
// });

// Create a new genre
router.post('/', authMiddleware, asyncMiddleware(async (req, res, next) => {
    // check if course is valid
    const { error } = validateResource(req.body, validation_schema);

    // if fails 400 Bad request
    if (error)
        return res.status(400).send(error.details[0].message);

    // create new genre
    const genre = await new GenreClass({ name: req.body.name }).save();

    // send genre
    return res.status(201).send(genre);
}));
// router.post('/', authMiddleware, async (req, res) => {
//     // check if course is valid
//     const { error } = validateResource(req.body, validation_schema);

//     // if fails 400 Bad request
//     if (error)
//         return res.status(400).send(error.details[0].message);

//     // create new genre
//     const genre = await new GenreClass({ name: req.body.name }).save();

//     // send genre
//     return res.status(201).send(genre);
// });

// Update specific resource
router.put('/:id', authMiddleware, asyncMiddleware(async (req, res, next) => {
    // check if input valid
    const { error } = validateResource(req.body, validation_schema);
    // if not 400 Bad request
    if (error)
        return res.status(400).send(error.details[0].message);

    const genre = await GenreClass.findByIdAndUpdate(req.params.id,
        { name: req.body.name },
        { new: true });
    // if fails 404 Not found
    if (!genre)
        return res.status(404).send('Resource not found! - 1');

    // send response
    return res.send(genre);
}));
// router.put('/:id', authMiddleware, async (req, res) => {
//     // check if input valid
//     const { error } = validateResource(req.body, validation_schema);
//     // if not 400 Bad request
//     if (error)
//         return res.status(400).send(error.details[0].message);

//     const genre = await GenreClass.findByIdAndUpdate(req.params.id,
//         { name: req.body.name },
//         { new: true });
//     // if fails 404 Not found
//     if (!genre)
//         return res.status(404).send('Resource not found! - 1');

//     // send response
//     return res.send(genre);
// });

// Delete specific resource
router.delete('/:id', [authMiddleware, isAdminMiddleware], asyncMiddleware(async (req, res, next) => {
    const genre = await GenreClass.findByIdAndRemove(req.params.id);

    // if not 404
    if (!genre)
        return res.status(404).send('Not found! - 1')

    return res.send(genre);
}));
// router.delete('/:id', [authMiddleware, isAdminMiddleware], async (req, res) => {
//     const genre = await GenreClass.findByIdAndRemove(req.params.id);

//     // if not 404
//     if (!genre)
//         return res.status(404).send('Not found! - 1')

//     return res.send(genre);
// });

module.exports = router;