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
        const LimitProductsForPage = 9;

        let parameter = {};
        categoria === 'todos' ? {} : parameter.categoria = categoria;


        console.log('Tipos: ', parameter);

        const filterProducts = await mongoose.connection.collection('productos').find(parameter)
            .sort({ nombre: 1 })
            .limit(LimitProductsForPage)
            .skip(page === 1 ? 1 : ((parseInt(page) - 1) * LimitProductsForPage))
            .toArray();


        const filter = filterProducts.filter(producto => {
            const price = (producto.precio >= minPrice && producto.precio <= maxPrice || !minPrice && !maxPrice);
            return price;
        });
        console.log('Nuevos productos con filtro: ', filter);
        console.log('Productos size: ', filter.length);

        res.status(200).send({ code: 0, message: 'Productos con filtro obtenidos', products: filter });
    } catch (error) {
        res.status(200).send({ code: 5, message: error.message });
    }
});

module.exports = manage_products_filter;
