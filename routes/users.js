const express = require('express');
const validateResource = require('../middleware/validator');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const { UserClass, validation_schema } = require('../models/user-model');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');

// 3rd party utilities
const _ = require('lodash');

// GET, /me ,not expose user id, instead use jwt, authotization check if user has access to resource or not
router.get('/me', authMiddleware, (req, res) => {
    const response = (async() => {
        try {
            const user = await UserClass.findById(req.user._id)
                            .select('-password');

            return res.send(user);
        } catch (error) {
            console.error('Cannot get data', error);
            return res.status(400).send('Bad request');
        }
    })();

    return response;
});

// POST , resgister user
router.post('/', (req, res) => {
    const response = (async () => {
        try {
            const { error } = validateResource(req.body, validation_schema);

            if (error)
                return res.status(400).send(error.details[0].message);

            // let passwordError = Joi.validate(req.body.password, new PasswordComplexity(PasswordComplexity.userPassword));

            // if (passwordError)
            //     return res.status(400).send(passwordError.error.details[0].message);

            // CHECK IF USER ALREADY EXIST
            let user = await UserClass.findOne({ email: req.body.email });
            if (user)
                return res.status(400).send('User already registered');

            user = new UserClass(_.pick(req.body, ['name', 'email', 'password']));

            // hashing password
            user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
            await user.save();
            
            // generate token
            const token = user.generateAuthToken();

            return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
        } catch (error) {
            console.error('Cannot get data', error);
            return res.status(400).send('Bad request');
        }
    })();

    return response;
});

module.exports = router;