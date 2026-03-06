const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mailjetService = require('../servicios/mailjetService');
const jwtService = require('../servicios/jwtService');

const clientRouter = express.Router();

clientRouter.post('/Registro', async (req, resp, next) => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        const existClient = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': req.body.email });

        if (existClient) throw new Error('Ese cliente ya existe en la base de datos');

        const insertData = await mongoose.connection.collection('clientes').insertOne(
            {
                nombreCompleto: req.body.nombre,
                cuenta: {
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                    genero: req.body.genero,
                    cuentaActiva: false,
                    imagenCuenta: '',
                    creacionCuenta: Date.now(),
                },
                pedidos: [],
                carrito: [],
                direcciones: []
            }
        )

        console.log('Datos insertados en la base de datos: ', insertData);
        if (!insertData.insertedId) throw new Error('No se pudo realizar la inserción');

        // 2º mandar email
        const token = jwtService.generateToken({ idCliente: insertData.insertedId, email: req.body.email }, { expiresIn: '10min' });
        mailjetService.sendEmail({ nombre: req.body.nombre, email: req.body.email }, token);

        console.log('Cliente registrado correctamente');
        resp.status(200).send({ code: 0, message: 'Cliente registrado correctamente' });
    } catch (error) {
        console.log('Error en el Registro: ', error);
        resp.status(200).send({ code: 1, message: `Error en el Registro: ${error}` });
    }


})

clientRouter.get('/ActivacionCuenta', async (req, resp, next) => {
    try {
        const { token, email } = req.query;
        const verifyToken = jwtService.verifyToken(token);

        if (verifyToken.email !== email) throw new Error('El email del token no coincide con el email de la consulta');

        await mongoose.connect(process.env.URL_MONGODB);
        const updateData = await mongoose.connection.collection('clientes').updateOne(
            { _id: new mongoose.Types.ObjectId(verifyToken.idCliente) },
            { $set: { 'cuenta.cuentaActiva': true } }
        )

        if (!updateData) throw new Error('No se pudo activar la cuenta');

        console.log('Cuenta activada correctamente');
        resp.status(200).send({ code: 0, message: 'Cuenta activada correctamente' });
    } catch (error) {
        console.log('Error en la activacion de cuenta: ', error);
        resp.status(200).send({ code: 3, message: `Error en la activacion de cuenta: ${error}` });
    }
})

clientRouter.post('/Login', (req, resp, next) => {
    try {

    } catch (error) {
        console.log('Error en el Login: ', error);
        resp.status(200).send({ code: 2, message: `Error en el Login: ${error}` });
    }
})

module.exports = clientRouter;