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
manage_products_filter.post('/FiltrarProductos', async (req, res, next) => {
    try {
        console.log(JSON.stringify(req.body));
        const types = Object.keys(req.body.dataFilter);

        console.log('Tipos: ', types);

        const filterProducts = await mongoose.connection.collection('productos').find().toArray();

        const filter = filterProducts.filter(el => {
            const category = types.length === 0 || types.includes(el.categoria);
            const price = (el.precio >= req.body.priceFilter.minimo && el.precio <= req.body.priceFilter.maximo || !req.body.priceFilter.minimo && !req.body.priceFilter.maximo);

            return category && price;
        })
        // filterProducts.forEach(el => {
        //     if (types.includes(el.categoria)) {
        //         filter.push(el);
        //     }
        // });
        console.log('Nuevos productos con filtro: ', filter);

        res.status(200).send({ code: 0, message: 'Productos con filtro obtenidos', products: filter });
    } catch (error) {
        res.status(200).send({ code: 5, message: error });
    }
});

module.exports = manage_products_filter;
