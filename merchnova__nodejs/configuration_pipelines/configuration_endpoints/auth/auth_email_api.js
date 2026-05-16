const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwtService = require('../../servicios/jwtService');
const crypto = require('crypto');
const { request_google } = require('../../servicios/peticiones_api_externas/request_api_external');
const mailjetService = require('../../servicios/mailjetService');

const manage_auth_email = express.Router();

// LÓGICA DE REGISTRO DE UN USUARIO
manage_auth_email.post('/Registro', async (req, resp, next) => {
    try {
        const { nombre, email, password, confirmPassword } = req.body;

        // COMPROBAR SI SE ENVIAN TODOS LOS DATOS AL SERVIDOR
        if (!nombre || !email || !password || !confirmPassword) throw new Error('Falta algún campo obligatorio.');


        // COMPROBAR SI EXISTE EL CLIENTE EN LA BASE DE DATOS, SI ES ASI ERROR
        const existClient = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': req.body.email });

        if (existClient) throw new Error('Ese correo ya existe, prueba con otro correo.');


        // COMPROBAR SI COINCIDEN LOS CAMPOS DE "CONTRASEÑA" Y "COMPROBAR CONTRASEÑA"
        if (req.body.password !== req.body.confirmPassword) throw new Error('Las contraseñas no coinciden.');


        // INSERTAR LOS DATOS A LA BASE DE DATOS
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
                    tipo: 'email',
                    rol: 'CLIENTE',
                    visibilidad: 'publico',
                    notificaciones: false
                },
                pedidos: [],
                carrito: {
                    itemsPedido: [],
                    gastosEnvio: 0,
                    subtotal: 0,
                    total: 0
                },
                direcciones: [],
                chats: []
            }
        )

        //console.log('Datos insertados en la base de datos: ', insertData);
        if (!insertData.insertedId) throw new Error('No se pudo realizar la inserción de datos.');


        // MANDAR EMAIL AL USUARIO PARA QUE ACTIVE LA CUENTA
        mailjetService.sendEmail({ nombre: req.body.nombre, email: req.body.email }, token);


        // GENERAR TOKEN DE ACCESO Y DE REFRESCO
        const token = jwtService.generateToken({ idCliente: insertData.insertedId, email: req.body.email }, { expiresIn: '10min' });

        resp.status(200).send({ code: 0, message: 'Has recibido un correo para activar tu cuenta, revisa tu correo.' });
    } catch (error) {
        //console.log('Error en el Registro: ', error);
        resp.status(200).send({ code: 1, message: error.message });
    }


})


// LÓGICA DE ACTIVACIÓN DE CUENTA DEL USUARIO
manage_auth_email.get('/Activacion-Cuenta', async (req, resp, next) => {
    try {
        const { token, email } = req.query;

        // VERIFICAR EL TOKEN, SI NO ES VALIDO ERROR
        const verifyToken = jwtService.verifyToken(token);

        // COMPROBAR SI EL EMAIL DEL TOKEN COINCIDE CON EL EMAIL INTRODUCIDO, SI NO COINCIDE ERROR
        if (verifyToken.email !== email) throw new Error('El email del token no coincide con el email introducido.');


        // SI TODO ES VÁLIDO, ENTONCES SE ACTIVA LA CUENTA PARA UTILIZARLA
        const updateData = await mongoose.connection.collection('clientes').updateOne(
            { _id: new mongoose.Types.ObjectId(verifyToken.idCliente) },
            { $set: { 'cuenta.cuentaActiva': true } }
        )

        if (updateData.modifiedCount === 0) throw new Error('No se pudo activar la cuenta.');

        //console.log('Cuenta activada correctamente');
        resp.redirect(`${process.env.URL_FRONTEND}Cliente/Login?activada=true`);
    } catch (error) {
        //console.log('Error en la activacion de cuenta: ', error);
        resp.redirect(`${process.env.URL_FRONTEND}Cliente/Login?activada=false`);
    }
})


// LÓGICA PARA INICIAR SESIÓN DE UN USUARIO
manage_auth_email.post('/Login', async (req, resp, next) => {
    try {
        const { email, password, tokenRecaptcha } = req.body;
        const URL_RECAPTCHA = `https://recaptchaenterprise.googleapis.com/v1/projects/merchnova/assessments?key=${process.env.GOOGLE_APIKEY}`;

        // SI NO RECIBE TODOS LOS DATOS DEL FORMULARIO, INCLUIDO RECAPTCHA, ERROR
        if (!tokenRecaptcha) throw new Error('Debes activar el ReCAPTCHA.')
        if (!email || !password) throw new Error('Los campos no pueden quedar vacíos.');


        // VERIFICACIÓN DE RECAPTCHA
        const requestVerification = {
            "event": {
                "token": tokenRecaptcha,
                "expectedAction": "LOGIN",
                "siteKey": process.env.GOOGLE_RECAPTCHA,
            }
        }

        // PETICION PARA VERIFICAR EL RECAPTCHA ENVIADO POR EL USUARIO POR CHECKBOX
        const responseRecaptcha = await request_google.verification_recaptcha(URL_RECAPTCHA, requestVerification);
        

        // VERIFICAR LA PETICION DE RECAPTCHA, SI ES VALIDA Y POR PUNTUACION
        if (responseRecaptcha.error) throw new Error('Error en la verificación de reCAPTCHA, intentalo de nuevo.');
        if (!responseRecaptcha.tokenProperties.valid || responseRecaptcha.riskAnalysis.score < 0.5) throw new Error('Verificación de reCAPTCHA fallida, vuelve a intentarlo.');


        // COMPROBAR SI EL USUARIO EXISTE EN BASE DE DATOS, SI NO ERROR
        const existClient = await mongoose.connection.collection('clientes').findOne({'cuenta.email': email});
        if (!existClient) throw new Error('Login fallido, el email no existe.');

        // COMPROBAR SI LA CONTRASEÑA DEL USUARIO ES CORRECTA Y SI LA CUENTA ESTA ACTIVADA
        if (!bcrypt.compareSync(password, existClient.cuenta.password)) throw new Error('La contraseña del usuario es incorrecta.');
        if (!existClient.cuenta.cuentaActiva) throw new Error('Cuenta no activada, revisa tu email para activar tu cuenta.');


        // PROPORCIONAR TOKENS AL USUARIO PARA MANTERNERLO "LOGEADO"
        const accessToken = jwtService.generateToken({ idCliente: existClient._id.toString(), email: existClient.cuenta.email }, { expiresIn: '2h' });
        const refreshToken = jwtService.generateToken({ idCliente: existClient._id.toString(), email: existClient.cuenta.email }, { expiresIn: '2d' });

        resp.status(200).send({ code: 0, message: 'Has hecho login con éxito', data: { clientData: existClient, accessToken, refreshToken } });
    } catch (error) {
        resp.status(200).send({ code: 2, message: error.message });
    }
});


manage_auth_email.post('/Perfil-Update', async (req, res, next) => {
    try {
        let campos = Object.keys(req.body);
        let data = {};
        campos.map((campo) => {
            if (campo !== undefined && campo !== null) {
                if (campo === 'nombreCompleto') {
                    data.nombreCompleto = req.body[campo];
                } else if (campo === 'pais' || campo === 'municipio' || campo === 'provincia' || campo === 'codigoPostal' || campo === 'domicilio') {
                    data["direcciones.0." + campo] = req.body[campo];
                } else {
                    data["cuenta." + campo] = req.body[campo];
                }
            }
        });

        console.log('Objeto data: ', data);

        const updateClient = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { 'cuenta.email': req.body.email },
            {$set: data},
            { returnDocument: "after" }
        )

        console.log('Nuevo cliente actualizado: ', updateClient);
        if (!updateClient) throw new Error("No se pudo actualizar los datos.");

        res.status(200).send({ code: 0, message: 'Los datos han sido actualizados con éxito.', data: { newClientData: updateClient } });
    } catch (error) {
        res.status(200).send({ code: 4, message: `${error}` });
    }
});


module.exports = manage_auth_email;