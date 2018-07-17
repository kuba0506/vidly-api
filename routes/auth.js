const express = require('express');
const router = express.Router();
const { UserClass, validation_schema } = require('../models/user-model');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// POST , resgister user - login / logout
router.post('/', (req, res) => {
    const response = (async () => {
        try {
            // validate body
            const { error } = validate(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);

            // validate email
            let user = await UserClass.findOne({ email: req.body.email });
            if (!user)
                return res.status(400).send('Invalid email or password');

            // validate password
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword)
                return res.status(400).send('Invalid email or password2');

            // create JWT
            const token = user.generateAuthToken();

            return res.send(token);
        } catch (error) {
            console.error('Cannot get data', error);
            return res.status(400).send('Bad request');
        }
    })();

    return response;
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;