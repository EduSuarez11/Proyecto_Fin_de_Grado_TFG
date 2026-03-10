const express = require('express');
const mongoose = require('mongoose');
const shopRouter = express.Router();


shopRouter.get('/Productos', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        const products = await mongoose.connection.collection('productos').find().toArray();
        //console.log('Productos obtenidos de la base de datos: ', JSON.stringify(products));
        res.status(200).send({ code: 0, message: 'Productos obtenidos correctamente', data: products });
    } catch (error) {
        console.log('Error al obtener los productos: ', error);
        res.status(200).send({ code: 1, message: `Error al obtener los productos: ${error}` });
    }
});

module.exports = shopRouter;