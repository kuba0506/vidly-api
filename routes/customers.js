const express = require('express');
const router = express.Router();
const validateResource = require('../middleware/validator');
const { CustomerClass, validation_schema } = require('../models/customer-model');

// Course API
router.get('/', async (req, res) => {
    let customers;

    try {
        customers = await CustomerClass.find().sort('name');
    } catch (e) {
        console.error(`Cannot retrive resource ${e}`);
        return res.status(404).send('Resource not found!');
    }

    return res.send(customers);
});

router.get('/:id', (req, res) => {
    let customer = (async function tryCatch() {
        try {
            return res.send(await CustomerClass.findById(req.params.id));
        } catch (e) {
            console.error(`Error: ${e}`);
            return res.status(404).send('Resource not found');
        }
    })();

    return customer;
});

router.post('/', async (req, res) => {
    const { error } = validateResource(req.body, validation_schema);

    if (error)
        return res.status(400).send(error.details[0].message);

    const customer = await new CustomerClass(req.body).save()
        .catch(console.error);

    return res.status(201).send(customer);
});

router.put('/:id', (req, res) => {
    let customer = (async () => {
        try {
            let { error } = validateResource(req.body, validation_schema);

            if (error)
                return res.status(400).send(error.details[0].message);

            customer = await CustomerClass.findByIdAndUpdate(
                req.params.id,
                { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
                { new: true }
            );

            if (!customer)
                return res.status(404).send('Resource not found!');

            return res.send(customer);
        } catch (e) {
            console.error(`Cannot retrive resource ${e}`);
            return res.status(404).send('Resource not found!');
        }
    })();

    return customer;
});

router.delete('/:id', (req, res) => {
    let response = (async () => {
        try {
            const course = await CustomerClass.findByIdAndRemove(req.params.id);

            if (!course)
                return res.status(404).send('Resource not found1');

            return res.send(course);
        } catch (e) {
            console.error(`Error: ${e}`);
            return res.status(404).send('Resource not found2');
        }
    })();

    return response;
});

module.exports = router;