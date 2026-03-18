const express = require('express');
const mongoose = require('mongoose');
const shopRouter = express.Router();


shopRouter.get('/Productos', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        // Usar limit para obtener solo algunos productos destacados en el Home
        const products = await mongoose.connection.collection('productos').find().toArray();
        //console.log('Productos obtenidos de la base de datos: ', JSON.stringify(products));
        res.status(200).send({ code: 0, message: 'Productos obtenidos correctamente', data: products });
    } catch (error) {
        console.log('Error al obtener los productos: ', error);
        res.status(200).send({ code: 1, message: `Error al obtener los productos: ${error}` });
    } finally {
        await mongoose.connection.close();
    }
    
});

shopRouter.get('/Producto/camiseta/:path', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        const getProduct = await mongoose.connection.collection('productos').findOne({
            path: req.params.path
        })

        if (!getProduct) throw new Error('Producto no encontrado en la base de datos');

        console.log('Producto encontrado: ', getProduct);
        res.status(200).send({code: 0, message: 'Producto obtenido', product: getProduct});
    } catch (error) {
        console.log('Error al obtener el producto: ', error);
        res.status(200).send({ code: 2, message: `Error al obtener el producto: ${error}` });
    } finally {
        await mongoose.connection.close();
    }
})

module.exports = shopRouter;