const express = require('express');
const mongoose = require('mongoose');
const jwtService = require('../../servicios/jwtService');
const crypto = require('crypto');

const { google } = require('googleapis');
const { request_google } = require('../../servicios/peticiones_api_externas/request_api_external');

const manage_auth_google = express.Router();

const OAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_ID,
    process.env.GOOGLE_OAUTH_SECRET,
    'http://localhost:3000/api/Cliente/CallbackGoogle'
);

manage_auth_google.get('/Login-Google', async (req, res, next) => {
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

manage_auth_google.get('/CallbackGoogle', async (req, res, next) => {
    try {
        const { code } = req.query;
        const { tokens } = await OAuth2.getToken(code);
        let clientData;

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


        clientData = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': emailGoogle, 'cuenta.tipo': 'google' });

        if (!clientData) {
            const newClient = await mongoose.connection.collection('clientes').insertOne({
                nombreCompleto: nameGoogle,
                cuenta: {
                    tipo: 'google',
                    email: emailGoogle,
                    password: '',
                    genero: genderGoogle === 'male' ? 'Masculino' : 'Femenino',
                    cuentaActiva: true,
                    imagenCuenta: photoGoogle,
                    creacionCuenta: Date.now(),
                    sobreMi: '',
                    telefono: ''
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
            });
            clientData = await mongoose.connection.collection('clientes').findOne({ _id: newClient.insertedId });
        }

        //console.log('Cliente encontrado o creado: ', clientData);

        const accessToken = jwtService.generateToken({ idCliente: clientData._id, email: clientData.cuenta.email }, { expiresIn: '2h' });

        // CAMBIAR ESTO PARA REALIZARLO CON MICROSERVICIOS
        res.status(200).send(`
            <html>
                <body>
                    <script>
                        window.opener.postMessage(${JSON.stringify({ codigo: 0, mensaje: "Login con Google ok, info del perfil del usuario obtenida de google mediante la PEOPLE-API", dataUser: { client: clientData, accessToken } })}, '*')
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



module.exports = manage_auth_google;