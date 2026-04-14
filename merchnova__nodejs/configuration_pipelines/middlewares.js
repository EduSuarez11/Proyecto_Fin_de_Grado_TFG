// Configuración de PIPELINE de express
//const cookiesParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const mongoose  = require('mongoose');
const clientRouter = require('./configuration_endpoints/endpointsCliente');
const shopRouter = require('./configuration_endpoints/endpointsTienda');
const path = require("path");
const pathImages = path.join(__dirname, "../images");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        console.log('Conexion a mongoDB exitosa')
    } catch (err) {
        process.exit(1);
    }
};



module.exports = async (confServerExpress) => {
    await connectDB();
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