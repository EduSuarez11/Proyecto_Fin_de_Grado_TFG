const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mailjetService = require('../servicios/mailjetService');
const jwtService = require('../servicios/jwtService');
const crypto = require('crypto');
const dataCrypto = crypto.randomBytes(20).toString('hex');
const clientRouter = express.Router();
const { google } = require('googleapis');


const OAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_ID,
    process.env.GOOGLE_OAUTH_SECRET,
    'http://localhost:3000/api/Cliente/CallbackGoogle'
);

/**
 * Códigos de mensaje de error:
 *  1º Error Registro
 *  2º Error Login
 *  3º Error Activacion de la cuenta
 *  4º Error Actualizacion de datos
 *  5º Error en la URL Discord
 *  6º Error de Discord login
 *  7º Error en Google Login
 *  8º Error en verificar token
 */

clientRouter.post('/Registro', async (req, resp, next) => {
    try {
        const { nombre, email, password, confirmPassword } = req.body;
        if (!nombre || !email || !password || !confirmPassword) throw new Error('Falta algún campo obligatorio.');

        
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
                carrito: {
                    itemsPedido: [],
                    cuponDescuento: [],
                    gastosEnvio: 0,
                    subtotal: 0,
                    total: 0
                },
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
    } 


})

clientRouter.get('/ActivacionCuenta', async (req, resp, next) => {
    try {
        const { token, email } = req.query;
        const verifyToken = jwtService.verifyToken(token);

        if (verifyToken.email !== email) throw new Error('El email del token no coincide con el email enviado.');

        
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
    } 
})

clientRouter.post('/Login', async (req, resp, next) => {
    try {
        const { email, password, tokenRecaptcha } = req.body;
        const URL_RECAPTCHA = `https://recaptchaenterprise.googleapis.com/v1/projects/merchnova/assessments?key=${process.env.GOOGLE_APIKEY}`;

        if (!tokenRecaptcha) throw new Error('Debes activar el ReCAPTCHA.')
        if (!email || !password) throw new Error('Los campos no pueden quedar vacíos.');

        const requestVerification = {
            "event": {
                "token": tokenRecaptcha,
                "expectedAction": "LOGIN",
                "siteKey": process.env.GOOGLE_RECAPTCHA,
            }
        }

        const requestRecaptcha = await fetch(URL_RECAPTCHA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestVerification)
        });

        const responseRecaptcha = await requestRecaptcha.json();

        if (responseRecaptcha.error) throw new Error('Error en la verificación de reCAPTCHA, intentalo de nuevo.');

        if (!responseRecaptcha.tokenProperties.valid || responseRecaptcha.riskAnalysis.score < 0.5) throw new Error('Verificación de reCAPTCHA fallida, la petición podría ser fraudulenta.');

        
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

        // const tokenVerify = jwtService.verifyToken(accessToken);
        // if (tokenVerify.email !== email) throw new Error('Error en el token, el email no coincide');

        resp.status(200).send({ code: 0, message: 'Has hecho login con éxito', data: { clientData: existClient, accessToken, refreshToken } });

    } catch (error) {
        resp.status(200).send({ code: 2, message: `${error}` });
    } 
});


clientRouter.get('/LoginDiscord', async (req, resp, next) => {
    try {
        const URL_REDIRECT = encodeURIComponent('http://localhost:5173/Proceso-Login-Discord');
        const URL_DISCORD = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${URL_REDIRECT}&state=${dataCrypto}&scope=identify+email`;

        resp.status(200).send({ code: 0, message: 'URL obtenida', url: URL_DISCORD });
    } catch (error) {
        resp.status(200).send({ code: 5, message: 'URL obtenida', url: URL_DISCORD });
    }
});


clientRouter.post('/DiscordCallback', async (req, resp, next) => {
    try {
        const { code } = req.body;
        console.log('Codigo: ', code);
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:5173/Proceso-Login-Discord'
        });

        if (!code) throw new Error('Fallo al obtener el código de autorización.');

        const requestApiDiscord = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const responseApiDiscord = await requestApiDiscord.json();
        console.log('Respuesta de api discord: ', responseApiDiscord);

        const requestData = await fetch('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${responseApiDiscord.access_token}`
            }
        });

        const dataUser = await requestData.json();
        console.log('Datos del usuario: ', dataUser);

        resp.status(200).send({ code: 0, message: 'Datos recibidos correctamente', user: dataUser });
    } catch (error) {
        console.log('Error en login discord: ', error);
        resp.status(200).send({ code: 6, message: `${error}` });
    }
});

clientRouter.get('/Verify/Token', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        

        const verifyToken = jwtService.verifyToken(token);

        //console.log('Token v: ', verifyToken)
        const user = await mongoose.connection.collection('clientes').findOne({
            _id: new mongoose.Types.ObjectId(verifyToken.idCliente)
        })
        console.log('Usuario: ', user);

        res.status(200).send({ code: 0, message: 'Token verificado.', data: { user } });
    } catch (error) {
        res.status(200).send({ code: 8, message: `${error}` });
    }
});

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
        

        const updateClient = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { 'cuenta.email': req.body.email },
            {
                $set: data
            },
            { returnDocument: "after" }
        )

        console.log('Nuevo cliente actualizado: ', updateClient);
        if (!updateClient) throw new Error("No se pudo actualizar los datos.");

        res.status(200).send({ code: 0, message: 'Los datos han sido actualizados con éxito.', data: { newClientData: updateClient } });
    } catch (error) {
        res.status(200).send({ code: 4, message: `${error}` });
    } 
});



clientRouter.get('/LoginGoogle', async (req, res, next) => {
    try {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/user.addresses.read',
            'https://www.googleapis.com/auth/user.gender.read'
            //'https://www.googleapis.com/auth/user.phonenumbers.read'
        ];

        const url_google = OAuth2.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: crypto.randomBytes(32).toString('hex')
        });

        res.status(200).send({ code: 0, message: 'URL de Google obtenida', url: url_google });
    } catch (error) {
        console.log('Error en LoginGoogle: ', error);
        res.status(200).send({ code: 7, message: error });
    } 
});

clientRouter.get('/CallbackGoogle', async (req, res, next) => {
    try {
        const { code } = req.query;
        const { tokens } = await OAuth2.getToken(code);

        if (!tokens) throw new Error('No se pudieron obtener los tokens.');

        OAuth2.setCredentials(tokens);

        const peopleApi = google.people({ version: 'v1', auth: OAuth2 });

        const userInfo = await peopleApi.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,genders,names,photos'
        });

        const emailGoogle = userInfo.data.emailAddresses && userInfo.data.emailAddresses.length > 0 ? userInfo.data.emailAddresses[0].value : null;
        const nameGoogle = userInfo.data.names && userInfo.data.names.length > 0 ? userInfo.data.names[0].givenName : null;
        const genderGoogle = userInfo.data.genders && userInfo.data.genders.length > 0 ? userInfo.data.genders[0].value : null;
        const photoGoogle = userInfo.data.photos && userInfo.data.photos.length > 0 ? userInfo.data.photos[0].url : null;

        console.log('Datos obtenidos de Google: ', JSON.stringify({ emailGoogle, nameGoogle, genderGoogle, photoGoogle }));

        // CAMBIAR ESTO PARA REALIZARLO CON MICROSERVICIOS
        res.status(200).send(`
            <html>
                <body>
                    <script>
                        window.opener.postMessage(${JSON.stringify({ codigo: 0, mensaje: "Login con Google ok, info del perfil del usuario obtenida de google mediante la PEOPLE-API", dataUser: { email: emailGoogle, name: nameGoogle, gender: genderGoogle, photo: photoGoogle } })}, '*')
                        window.close();
                    </script>
                </body>
            </html>
            `)
    } catch (error) {
        console.log('Error en el callback de Google: ', error);
        res.status(200).send({ codigo: 9, mensaje: error });
    } 

});


module.exports = clientRouter;