const express = require('express');

const server = express();

server.listen(3000, (error) => {
    if (!error) {
        console.log('Servidor Web iniciado en el puerto 3000');
    } else {
        console.log('Error al iniciar el servidor: ', error);
    }
})