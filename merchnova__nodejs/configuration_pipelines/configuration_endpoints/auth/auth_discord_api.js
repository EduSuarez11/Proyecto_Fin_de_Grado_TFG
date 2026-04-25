const express = require('express');
const mongoose = require('mongoose');
const jwtService = require('../../servicios/jwtService');
const { request_discord } = require('../../servicios/peticiones_api_externas/request_api_external');
const crypto = require('crypto');
const manage_auth_discord = express.Router();
dataCrypto = crypto.randomBytes(32).toString('hex');

manage_auth_discord.get('/Url-Discord', async (req, resp, next) => {
    try {
        const URL_REDIRECT = encodeURIComponent('http://localhost:5173/Proceso-Login-Discord');
        const URL_DISCORD = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${URL_REDIRECT}&state=${dataCrypto}&scope=identify+email`;

        resp.status(200).send({ code: 0, message: 'URL obtenida', url: URL_DISCORD });
    } catch (error) {
        console.log('Error en url discord: ', error)
        resp.status(200).send({ code: 5, message: 'No se pudo obtener la url de discord' });
    }
});


manage_auth_discord.post('/DiscordCallback', async (req, resp, next) => {
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

        const responseApiDiscord = await request_discord.token_api_discord(params);
        console.log('Respuesta de api discord: ', responseApiDiscord);

        const dataUser = await request_discord.user_api_discord(responseApiDiscord.access_token);
        console.log('Datos del usuario: ', dataUser);

        resp.status(200).send({ code: 0, message: 'Datos recibidos correctamente', user: dataUser });
    } catch (error) {
        console.log('Error en login discord: ', error);
        resp.status(200).send({ code: 6, message: `${error}` });
    }
});


manage_auth_discord.post('/Data-Discord', async (req, res, next) => {
    try {
        const data = req.body;
        //console.log('Datos de discord: ', data);

        const URL_IMAGE = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        let dataClient;
        dataClient = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': data.email });

        if (!dataClient) {
            const newClient = await mongoose.connection.collection('clientes').insertOne(
                {
                    nombreCompleto: data.global_name,
                    cuenta: {
                        email: data.email,
                        password: '',
                        genero: 'Neutro',
                        cuentaActiva: true,
                        imagenCuenta: URL_IMAGE,
                        creacionCuenta: Date.now(),
                        telefono: '',
                        tipo: 'discord'
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
            dataClient = await mongoose.connection.collection('clientes').findOne({ _id: newClient.insertedId });
        }

        const accessToken = jwtService.generateToken({ idCliente: dataClient._id, email: dataClient.cuenta.email }, { expiresIn: '2h' });

        res.status(200).send({ code: 0, message: 'Datos de discord obtenidos.', data: { user: dataClient, access_token: accessToken } });
    } catch (error) {
        res.status(200).send({ code: 10, message: 'Error al incluir los datos en BBDD' });
    }
});

module.exports = manage_auth_discord
