const { UserClass } = require('../../../models/user-model');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jwt', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new UserClass(payload);

        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwt-private-key'));

        expect(decoded).toMatchObject(payload);
    });
});