// Configuración de PIPELINE de express
//const cookiesParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const manage_auth_email = require('./configuration_endpoints/auth/auth_email_api');
const manage_auth_google = require('./configuration_endpoints/auth/auth_google_api');
const manage_auth_discord = require('./configuration_endpoints/auth/auth_discord_api');
const manage_products = require('./configuration_endpoints/productos/products_api');
const manage_products_filter = require('./configuration_endpoints/productos/filter_api');
const manage_cart = require('./configuration_endpoints/carrito/cart_api');
const manage_category = require('./configuration_endpoints/productos/category_api');
const manage_profile_data = require('./configuration_endpoints/profile/profile_api');
const manage_auth_token = require('./configuration_endpoints/auth/auth_token_api');
const manage_payment = require('./configuration_endpoints/pago/payment_api');
const manage_clients = require('./configuration_endpoints/auth/clients_api');
const manage_chat = require('./configuration_endpoints/chat/chat_api');
const pathImages = path.join(__dirname, "../images");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        //console.log('Conexion a mongoDB exitosa')
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
    confServerExpress.use(cors({
        origin: ['http://localhost:5173', 'https://merchnova-web.onrender.com/'],
        credentials: true
    }));
    //confServerExpress.use(cors());

    confServerExpress.use("/images", express.static(pathImages));

    // Configuracion de "auth"
    confServerExpress.use('/api/auth', manage_auth_email);
    confServerExpress.use('/api/Cliente', manage_auth_google);
    confServerExpress.use('/api/Cliente', manage_auth_discord);
    confServerExpress.use('/api/auth', manage_auth_token);
    confServerExpress.use('/api/auth', manage_clients);


    // Configuracion de "products"
    confServerExpress.use('/api/products', manage_products);
    confServerExpress.use('/api/products', manage_products_filter);
    confServerExpress.use('/api/products', manage_category);

    // Configuracion de "chat"
    confServerExpress.use('/api/chat', manage_chat);

    // Configuracion de "cart"
    confServerExpress.use('/api/cart', manage_cart);

    // Configuracion de "profile"
    confServerExpress.use('/api/profile', manage_profile_data);

    confServerExpress.use('/api/pay', manage_payment);
}