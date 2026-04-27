const express = require('express');
const mongoose = require('mongoose');

const manage_clients = express.Router();


manage_clients.get('/get-orders', async (req, res, next) => {
    try {
        const users = await mongoose.connection.collection('clientes').find({
            pedidos: { $exists: true, $ne: [] }
        }).toArray()

        //console.log('Usuarios con pedidos: ', users);

        res.status(200).send({ code: 0, message: 'Clientes con pedidos obtenidos.', data: { users } });
    } catch (error) {
        res.status(200).send({ code: 8, message: error.message });
    }
});

module.exports = manage_clients;
