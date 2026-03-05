require('dotenv').config();
const express = require('express');
const middlewares = require('./configuration_pipelines/middlewares');

const PORT = process.env.URL_SERVER_EXPRESS;
const server = express();

middlewares(server);

server.listen(PORT, (error) => {
    if (!error) {
        console.log('Servidor Web iniciado en el puerto 3000');
    } else {
        console.log('Error al iniciar el servidor: ', error);
    }
})