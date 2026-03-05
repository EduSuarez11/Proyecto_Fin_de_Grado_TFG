const jwt = require('jsonwebtoken');


module.exports = {
    generateToken: (payload, expiration) => {
        const TokenCreated = jwt.sign(payload, process.env.FIRMA_JWT, expiration);

        return TokenCreated;
    }
}