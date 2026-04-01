const express = require('express');
const mongoose = require('mongoose');
const stripeService = require('../servicios/stripeService');
const shopRouter = express.Router();

/**
 * Códigos de mensaje de error:
 *  1º Error en obtener todos los productos
 *  2º Error en obtener el producto que eliges para comprar o añadir al carrito
 *  3º Error en obtener los productos de la página principal (Home.jsx)
 *  4º Error en el pago con tarjeta
 */


// OBTENER TODOS LOS PRODUCTOS PARA MOSTRARLOS EN LA VISTA DE PRODUCTOS.JSX
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

// OBTENER EL PRODUCTO QUE ESCOGES AL VER SU INFO
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


// OBTENER 4 PRODUCTOS PARA MOSTRAR EN EL HOME
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
});

// MÉTODO PARA REALIZAR LOS PASOS DE STRIPE
async function useService(client, order, paymethod, existIds) {
    let clientId;
    let cardId;

    if (!existIds) {
        // 1º Paso: Id cliente
        clientId = await stripeService.CreateStripeClient_1(client.nombreCompleto, client.cuenta.email, order.direccionEnvio);
        if (!clientId) throw new Error('No se ha podido obtener el id de cliente de Stripe.');

        // 2º Paso: Id tarjeta
        cardId = await stripeService.CreateCard_2(clientId, order.metodoPago);
        if (!cardId) throw new Error('No se ha podido al obtener el id de tarjeta.');

        const updateData = await mongoose.connection.collection('clientes').updateOne({
            'cuenta.email': client.cuenta.email
        },
            {
                $push: {
                    metodoPago: {
                        tipo: 'tarjeta',
                        info: {
                            clientId,
                            cardId
                        }
                    }
                }
            }
        );

        if (!updateData.acknowledged) throw new Error('No se pudo actualizar los identificadores.');
    } else {
        cardId = paymethod.info.cardId;
        clientId = paymethod.info.clientId;
    }
    // 3º Paso: Cobro
    order._id = new mongoose.Types.ObjectId();
    const createCharge = await stripeService.ChargeClient_3(clientId, cardId, order.total, order._id.toString());

    if (!createCharge) throw new Error('No se pudo crear el cobro del pedido.');

    pedidos.fechaPago = new Date(Date.now());
    const setOrders = await mongoose.connection.collection('clientes').updateOne(
        { 'cuenta.email': client.cuenta.email },
        {
            $push: {
                pedidos: order
            }
        }
    );

    if (!setOrders) throw new Error('No se pudo actualizar los datos de pedido.');

}


// EJECUTAR EL PAGO CON TARJETA ...
shopRouter.post('/RealizarCompra', async (req, res, next) => {
    try {
        const { client, order } = req.body;

        console.log('Todos los datos: ', req.body);
        await mongoose.connect(process.env.URL_MONGODB);
        if (order.metodoPago.tipo === 'tarjeta') {
            // Comprobar si el cliente va a pagar por primera vez o ya lo ha hecho anteriormente
            const existPay = mongoose.connection.collection('clientes').findOne({
                'metodoPago': {
                    $elemMatch: {
                        tipo: 'tarjeta'
                    }
                }
            });

            if (!existPay) {
                // Si no existe el pago, crear un pago de Stripe
                useService(client, order, null, false);
            } else {
                // Si existe un pago, recoger id de cliente y tarjeta
                const getIds = mongoose.connection.collection('clientes').findOne(prop => prop.tipo === 'card');

                useService(client, order, getIds, true);
            }
        }

        res.status(200).send({ code: 0, message: 'Pago con tarjeta realizado correctamente' });
    } catch (error) {
        console.log('Error en la peticion middleware: ', error);
        res.status(200).send({ code: 4, message: error });
    }

});


module.exports = shopRouter;