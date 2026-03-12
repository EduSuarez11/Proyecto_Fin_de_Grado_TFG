// Configuración de PIPELINE de express
//const cookiesParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const clientRouter = require('./configuration_endpoints/endpointsCliente');
const shopRouter = require('./configuration_endpoints/endPointsTienda');
const path = require("path");
const pathImages = path.join(__dirname, "../images");

module.exports = (confServerExpress) => {
    // Configuracion de peticiones json

    //console.log('Configurando PIPELINE de Express...');
    confServerExpress.use(express.json());

    // Configuracion de peticiones URL
    confServerExpress.use(express.urlencoded({ extended: false }));

    // Configuracion CORS
    // confServerExpress.use(cors({
    //     origin: 'http://localhost:5173',
    //     credentials: true
    // }));
    confServerExpress.use(cors());

    confServerExpress.use("/images", express.static(pathImages));
    
    confServerExpress.use('/api/Cliente', clientRouter);
    confServerExpress.use('/api/Tienda', shopRouter);
}