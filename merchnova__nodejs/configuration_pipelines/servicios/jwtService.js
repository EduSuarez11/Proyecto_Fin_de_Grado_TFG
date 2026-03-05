const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (payload, expiration) => {
        const TokenCreated = jwt.sign(payload, process.env.FIRMA_JWT, expiration);
        return TokenCreated;
    },

    verifyToken: (token) => {
        const TokenVerify = jwt.verify(token, process.env.FIRMA_JWT);
        return TokenVerify;
    }
}