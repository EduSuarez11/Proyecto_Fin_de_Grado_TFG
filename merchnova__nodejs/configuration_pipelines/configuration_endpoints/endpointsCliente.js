const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mailjetService = require('../servicios/mailjetService');
const jwtService = require('../servicios/jwtService');

const clientRouter = express.Router();

/**
 * Códigos de mensaje de error:
 *  1º Error Registro
 *  2º Error Login
 *  3º Error Activacion de la cuenta
 *  4º Error Actualizacion de datos
 */

clientRouter.post('/Registro', async (req, resp, next) => {
    try {
        const { nombre, email, password, confirmPassword } = req.body;
        if (!nombre || !email || !password || !confirmPassword) throw new Error('Falta algún campo obligatorio.');

        await mongoose.connect(process.env.URL_MONGODB);
        const existClient = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': req.body.email });

        if (existClient) throw new Error('Ese correo ya existe, prueba con otro correo.');

        if (req.body.password !== req.body.confirmPassword) throw new Error('Las contraseñas no coinciden.');

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
        if (!insertData.insertedId) throw new Error('No se pudo realizar la inserción.');

        // 2º mandar email
        const token = jwtService.generateToken({ idCliente: insertData.insertedId, email: req.body.email }, { expiresIn: '10min' });
        mailjetService.sendEmail({ nombre: req.body.nombre, email: req.body.email }, token);

        resp.status(200).send({ code: 0, message: 'Has recibido un correo para activar tu cuenta, revisa tu correo.' });
    } catch (error) {
        console.log('Error en el Registro: ', error);
        resp.status(200).send({ code: 1, message: `${error}` });
    } finally {
        await mongoose.connection.close();
    }


})

clientRouter.get('/ActivacionCuenta', async (req, resp, next) => {
    try {
        const { token, email } = req.query;
        const verifyToken = jwtService.verifyToken(token);

        if (verifyToken.email !== email) throw new Error('El email del token no coincide con el email enviado.');

        await mongoose.connect(process.env.URL_MONGODB);
        const updateData = await mongoose.connection.collection('clientes').updateOne(
            { _id: new mongoose.Types.ObjectId(verifyToken.idCliente) },
            { $set: { 'cuenta.cuentaActiva': true } }
        )

        if (!updateData) throw new Error('No se pudo activar la cuenta.');

        console.log('Cuenta activada correctamente');
        resp.status(200).send({ code: 0, message: 'Cuenta activada correctamente. Registro con éxito.' });
    } catch (error) {
        console.log('Error en la activacion de cuenta: ', error);
        resp.status(200).send({ code: 3, message: `Error en la activacion de cuenta: ${error}` });
    } finally {
        await mongoose.connection.close();
    }
})

clientRouter.post('/Login', async (req, resp, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) throw new Error('Los campos no pueden quedar vacíos.');

        await mongoose.connect(process.env.URL_MONGODB);
        const existClient = await mongoose.connection.collection('clientes').findOne(
            {
                'cuenta.email': email
            }
        )

        if (!existClient) throw new Error('Login fallido, el email no existe.');

        if (!bcrypt.compareSync(password, existClient.cuenta.password)) throw new Error('Login fallido, la contraseña es incorrecta.');

        if (!existClient.cuenta.cuentaActiva) throw new Error('Cuenta no activada, revisa tu email para activar tu cuenta.');

        const accessToken = jwtService.generateToken({ idCliente: existClient._id.toString(), email: existClient.cuenta.email }, { expiresIn: '2h' });
        const refreshToken = jwtService.generateToken({ idCliente: existClient._id.toString(), email: existClient.cuenta.email }, { expiresIn: '2d' });

        const tokenVerify = jwtService.verifyToken(accessToken);
        if (tokenVerify.email !== email) throw new Error('Error en el token, el email no coincide');

        resp.status(200).send({ code: 0, message: 'Has hecho login con éxito', data: { clientData: existClient, accessToken, refreshToken } });

    } catch (error) {
        resp.status(200).send({ code: 2, message: `${error}` });
    } finally {
        await mongoose.connection.close();
    }
})


clientRouter.post('/Perfil/Update', async (req, res, next) => {
    try {
        let campos = Object.keys(req.body);
        let data = {};
        campos.map((campo) => {
            if (campo !== undefined && campo !== null) {
                if (campo === 'nombreCompleto') {
                    data.nombreCompleto = req.body[campo];
                } else if (campo === 'pais' || campo === 'municipio' || campo === 'provincia' || campo === 'codigoPostal' || campo === 'calle') {
                    data["direcciones.0." + campo] = req.body[campo];
                } else {
                    data["cuenta." + campo] = req.body[campo];
                }
            }
        });

        console.log('Objeto data: ', data);
        await mongoose.connect(process.env.URL_MONGODB);
        const client = await mongoose.connection.collection('clientes').findOne(
            {
                'cuenta.email': req.body.email
            }
        )
        console.log('Id cliente: ', client)

        const updateClient = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(client._id) },
            {
                $set: data
            },
            { new: true }
        )

        if (!updateClient) throw new Error("No se pudo actualizar los datos.");

        res.status(200).send({ code: 0, message: 'Los datos han sido actualizados.', data: { newClientData: updateClient } });
    } catch (error) {
        res.status(200).send({ code: 4, message: `${error}`, data: req.body });
    }
});

module.exports = clientRouter;