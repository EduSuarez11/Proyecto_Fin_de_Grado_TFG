require('dotenv').config();
const express = require('express');
const middlewares = require('./configuration_pipelines/middlewares');

const Puerto = process.env.PORT;
const server = express();

middlewares(server);

server.listen(Puerto, (error) => {
    if (!error) {
        console.log('Servidor Web iniciado en el puerto 3000');
    } else {
        console.log('Error al iniciar el servidor: ', error);
    }
})