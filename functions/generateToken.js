require('dotenv').config();

const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = {
        username: user.username,
    };

    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: '5m',
        jwtid: "12345"
    };

    return jwt.sign(payload, secret, options);
}

module.exports = generateToken;