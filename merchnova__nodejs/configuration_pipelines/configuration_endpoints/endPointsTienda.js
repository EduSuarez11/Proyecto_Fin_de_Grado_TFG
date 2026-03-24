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

shopRouter.get('/Producto/:categoria/:slug', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        const getProduct = await mongoose.connection.collection('productos').findOne({
            categoria: req.params.categoria,
            slug: req.params.slug
        })

        if (!getProduct) throw new Error('Producto no encontrado en la base de datos');

        const moreProducts = await mongoose.connection.collection('productos').aggregate([{
            $match: {
                nombre: { $ne: getProduct.nombre }
            }
        }, { $sample: { size: 4 } }]).toArray();

        //console.log('Producto encontrado: ', getProduct);
        res.status(200).send({ code: 0, message: 'Producto obtenido', product: getProduct, moreProducts });
    } catch (error) {
        console.log('Error al obtener el producto: ', error);
        res.status(200).send({ code: 2, message: `Error al obtener el producto: ${error}` });
    } finally {
        await mongoose.connection.close();
    }
})

shopRouter.get('/Productos/Home', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.URL_MONGODB);
        const products = await mongoose.connection.collection('productos').find().sort({ precio: -1 }).limit(4).toArray();

        if (!products) throw new Error('Productos no encontrados en la base de datos');

        //console.log('Producto encontrado: ', products);
        res.status(200).send({ code: 0, message: 'Producto home obtenidos', data: products });
    } catch (error) {
        console.log('Error al obtener el producto: ', error);
        res.status(200).send({ code: 3, message: `Error al obtener el producto: ${error}` });
    } finally {
        await mongoose.connection.close();
    }
})

module.exports = shopRouter;