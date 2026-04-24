const express = require('express');
const mongoose = require('mongoose');
const jwtService = require('../../servicios/jwtService');

const manage_auth_token = express.Router();


manage_auth_token.get('/Verify/Token', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const verifyToken = jwtService.verifyToken(token);
        //console.log('Token v: ', verifyToken)
        const user = await mongoose.connection.collection('clientes').findOne({
            _id: new mongoose.Types.ObjectId(verifyToken.idCliente)
        })
        //console.log('Usuario: ', user);

        res.status(200).send({ code: 0, message: 'Token verificado.', data: { user } });
    } catch (error) {
        res.status(200).send({ code: 8, message: error.message });
    }
});

module.exports = manage_auth_token;
