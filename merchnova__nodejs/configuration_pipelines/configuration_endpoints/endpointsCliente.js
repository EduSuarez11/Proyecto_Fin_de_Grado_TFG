const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clientRouter = express.Router();

clientRouter.post('/Registro', async (req, resp, next) => {
    try {
        mongoose.connect(process.env.URL_MONGODB);
        const existClient = await mongoose.connection.collection('clientes').findOne({ email: req.body.email });

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

        if (!insertData.insertedId) throw new Error('No se pudo realizar la inserción');    

    } catch (error) {
        resp.status(200).send({code : 1, message: `Error: ${error}`});
    }


})

clientRouter.post('/Login', (req, resp, next) => {

})