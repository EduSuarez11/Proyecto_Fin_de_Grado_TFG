const express = require('express');
const mongoose = require('mongoose');

const manage_products = express.Router();


// OBTENER TODOS LOS PRODUCTOS PARA MOSTRARLOS EN LA VISTA DE PRODUCTOS.JSX
manage_products.get('/Productos', async (req, res, next) => {
    try {
        // Usar limit para obtener solo algunos productos destacados en el Home
        const products = await mongoose.connection.collection('productos').find().toArray();

        res.status(200).send({ code: 0, message: 'Productos obtenidos correctamente', data: products });
    } catch (error) {
        console.log('Error al obtener los productos: ', error);
        res.status(200).send({ code: 1, message: `Error al obtener los productos: ${error}` });
    }
});


// OBTENER 4 PRODUCTOS PARA MOSTRAR EN EL HOME
manage_products.get('/Productos/Home', async (req, res, next) => {
    try {
        const products = await mongoose.connection.collection('productos').find().sort({ precio: -1 }).limit(4).toArray();

        if (!products) throw new Error('Productos no encontrados en la base de datos');

        res.status(200).send({ code: 0, message: 'Producto home obtenidos', data: products });
    } catch (error) {
        console.log('Error al obtener el producto: ', error);
        res.status(200).send({ code: 3, message: `Error al obtener el producto: ${error}` });
    }
});

module.exports = manage_products;