// Configuración de PIPELINE de express
//const cookiesParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const clientRouter = require('./configuration_endpoints/endpointsCliente');

module.exports = (confServerExpress) => {
    // Configuracion de peticiones json
    confServerExpress.use(express.json());

    // Configuracion de peticiones URL
    confServerExpress.use(express.urlencoded({ extended: false }));

    // Configuracion CORS
    // confServerExpress.use(cors({
    //     origin: 'http://localhost:5173',
    //     credentials: true
    // }));
    confServerExpress.use(cors());

    confServerExpress.use('/api/Cliente', clientRouter);
    confServerExpress.use('/api/Tienda', clientRouter)
}