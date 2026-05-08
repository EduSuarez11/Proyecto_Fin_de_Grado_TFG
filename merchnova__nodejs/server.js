require('dotenv').config();
const middlewares = require('./configuration_pipelines/middlewares');
const configSocketIO = require('./configuration_socket_io_server/socket_io_server')
const express = require('express');

const port = process.env.PORT;
const { createServer, Server } = require('node:http');
const server = express();
const servNode = createServer(server);
const io = new Server(servNode,)

middlewares(server);
configSocketIO(servNode);

servNode.listen(port, (error) => {
    if (!error) {
        console.log('Servidor Web iniciado en el puerto 3000');
    } else {
        console.log('Error al iniciar el servidor: ', error);
    }
})