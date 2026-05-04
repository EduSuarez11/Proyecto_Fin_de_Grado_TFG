const express = require('express');
const mongoose = require('mongoose');

const manage_products_filter = express.Router();

// OBTENER EL PRODUCTO QUE ESCOGES AL VER SU INFO
manage_products_filter.get('/Chosen/:categoria/:slug', async (req, res, next) => {
    try {

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
    }
})



// MUESTRA LOS PRODUCTOS FILTRADOS SEGÚN SU TIPO.
manage_products_filter.get('/FiltrarProductos', async (req, res, next) => {
    try {
        //console.log(JSON.stringify(req.body));
        //const types = Object.keys(req.body.dataFilter);
        const { categoria, minPrice, maxPrice, page } = req.query;
        const LimitProductsForPage = 12;
        //console.log('Precios: ', parseInt(minPrice), parseInt(maxPrice))
        //console.log('Parametros de url: ', JSON.stringify(req.query));
        let parameter = {};
        if (categoria && categoria !== 'todos') {
            parameter.categoria = categoria
        }

        if (minPrice && maxPrice && parseInt(minPrice) > 0 && parseInt(maxPrice) > 0) {
            parameter.precio = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }
        }

        //console.log(parameter);

        const filterProducts = await mongoose.connection.collection('productos').find(parameter)
            .sort({ path: 1 })
            .limit(LimitProductsForPage)
            .skip((parseInt(page) - 1) * LimitProductsForPage)
            .toArray();

        const total = await mongoose.connection.collection('productos').countDocuments(parameter);
        const totalPages = Math.ceil(total / LimitProductsForPage);
        //console.log('Productos size: ', filterProducts.length);

        res.status(200).send({ code: 0, message: 'Productos con filtro obtenidos', data: { products: filterProducts, totalPages, total, limit: LimitProductsForPage } });
    } catch (error) {
        console.log('Error: ', error);
        res.status(200).send({ code: 5, message: error.message });
    }
});

module.exports = manage_products_filter;
