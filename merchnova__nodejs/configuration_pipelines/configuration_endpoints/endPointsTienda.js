const express = require('express');
const mongoose = require('mongoose');
const stripeService = require('../servicios/stripeService');
const paypalService = require('../servicios/paypalService');
const shopRouter = express.Router();

/**
 * Códigos de mensaje de error:
 *  1º Error en obtener todos los productos
 *  2º Error en obtener el producto que eliges para comprar o añadir al carrito
 *  3º Error en obtener los productos de la página principal (Home.jsx)
 *  4º Error en el pago con tarjeta
 *  5º Persistir en carrito (añadir)
 *  6º Persistir en carrito (eliminar)
 *  7º Persistir en carrito (actualizar)
 */


// OBTENER TODOS LOS PRODUCTOS PARA MOSTRARLOS EN LA VISTA DE PRODUCTOS.JSX
shopRouter.get('/Productos', async (req, res, next) => {
    try {


        // Usar limit para obtener solo algunos productos destacados en el Home
        const products = await mongoose.connection.collection('productos').find().toArray();
        //console.log('Productos obtenidos de la base de datos: ', JSON.stringify(products));
        res.status(200).send({ code: 0, message: 'Productos obtenidos correctamente', data: products });
    } catch (error) {
        console.log('Error al obtener los productos: ', error);
        res.status(200).send({ code: 1, message: `Error al obtener los productos: ${error}` });
    }

});

// OBTENER EL PRODUCTO QUE ESCOGES AL VER SU INFO
shopRouter.get('/Producto/:categoria/:slug', async (req, res, next) => {
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


// OBTENER 4 PRODUCTOS PARA MOSTRAR EN EL HOME
shopRouter.get('/Productos/Home', async (req, res, next) => {
    try {

        const products = await mongoose.connection.collection('productos').find().sort({ precio: -1 }).limit(4).toArray();

        if (!products) throw new Error('Productos no encontrados en la base de datos');

        //console.log('Producto encontrado: ', products);
        res.status(200).send({ code: 0, message: 'Producto home obtenidos', data: products });
    } catch (error) {
        console.log('Error al obtener el producto: ', error);
        res.status(200).send({ code: 3, message: `Error al obtener el producto: ${error}` });
    }
});


// MUESTRA LOS PRODUCTOS FILTRADOS SEGÚN SU TIPO. QUEDA POR HACER POR PRECIO Y VALORACIÓN
shopRouter.post('/FiltrarProductos', async (req, res, next) => {
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



// MÉTODO PARA REALIZAR LOS PASOS DE STRIPE
async function useService(clientData, order, paymethod, existIds) {
    let clientId;
    let cardId;


    if (!existIds) {
        // 1º Paso: Id cliente
        clientId = await stripeService.CreateStripeClient_1(clientData.nombreCompleto, clientData.cuenta.email, order.direccionEnvio);
        if (!clientId) throw new Error('No se ha podido obtener el id de cliente de Stripe.');

        console.log('Cliente id: ', clientId)

        // 2º Paso: Id tarjeta
        cardId = await stripeService.CreateCard_2(clientId, order.metodoPago);
        if (!cardId) throw new Error('No se ha podido al obtener el id de tarjeta.');

        const updateData = await mongoose.connection.collection('clientes').updateOne({
            'cuenta.email': clientData.cuenta.email
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
        console.log('Datos actualizados: ', updateData);

        console.log(`Id de cliente ${clientId} y cardId ${cardId}`)

        if (!updateData.acknowledged) throw new Error('No se pudo actualizar los identificadores.');
    } else {
        cardId = paymethod.info.cardId;
        clientId = paymethod.info.clientId;
    }
    // 3º Paso: Cobro
    order._id = new mongoose.Types.ObjectId();
    const createCharge = await stripeService.ChargeClient_3(clientId, cardId, order.total, order._id.toString());

    console.log('Cargo pago: ', createCharge)
    if (!createCharge) throw new Error('No se pudo crear el cobro del pedido.');

    pedidos.fechaPago = new Date(Date.now());
    const setOrders = await mongoose.connection.collection('clientes').updateOne(
        { 'cuenta.email': clientData.cuenta.email },
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
        const { clientData, order } = req.body;

        clientData.carrito._id = new mongoose.Types.ObjectId();

        //console.log('Todos los datos: ', req.body);

        if (order.metodoPago.tipo === 'tarjeta') {
            // Comprobar si el cliente va a pagar por primera vez o ya lo ha hecho anteriormente
            const existPay = await mongoose.connection.collection('clientes').findOne({
                'metodoPago': {
                    $elemMatch: {
                        tipo: 'tarjeta'
                    }
                }
            });
            console.log('Existe previo pago: ', JSON.stringify(existPay))

            if (!existPay) {
                // Si no existe el pago, crear un pago de Stripe
                useService(clientData, order, null, false);
            } else {
                // Si existe un pago, recoger id de cliente y tarjeta
                const getIds = await mongoose.connection.collection('clientes').findOne(prop => prop.tipo === 'card');

                useService(clientData, order, getIds, true);
            }
        }
        res.status(200).send({ code: 0, message: 'Pago con tarjeta realizado correctamente' });
    } catch (error) {
        console.log('Error en la peticion middleware: ', error);
        res.status(200).send({ code: 4, message: error });
    }
});


async function findProduct(client, order) {
    const productExists = await mongoose.connection.collection('clientes').findOne({
        'cuenta.email': client.cuenta.email,
        'carrito.itemsPedido': {
            $elemMatch: {
                'producto.nombre': order.nombre
            }
        }
    });

    return productExists;
}


shopRouter.post('/Create/Order', async (req, res, next) => {
    try {
        const { clientData, order, direccionEnvio } = req.body;
        console.log(req.body);
        order._id = new mongoose.Types.ObjectId();
        const orderPaypal = await paypalService.CreateOrderPaypal_1(clientData, order);
        console.log('Datos de PayPal: ', orderPaypal);
        if (!orderPaypal) throw new Error('No se pudo crear la orden de PayPal.');

        order.metodoPago = {
            tipo: 'PayPal',
            info: {
                estado: 'PENDIENTE',
                idOrderPayPal: orderPaypal.id
            }
        };
        order.items = clientData.carrito.itemsPedido;
        order.subtotal = clientData.carrito.subtotal;
        order.total = clientData.carrito.total;
        order.fechaPago = null;
        order.fechaEnvio = null;
        order.direccionEnvio = {
            calle: direccionEnvio.direccion,
            municipio: direccionEnvio.municipio,
            provincia: direccionEnvio.provincia,
            codigo_postal: direccionEnvio.codigoPostal,
            pais: direccionEnvio.pais
        }
        order.direccionFacturacion = {
            calle: clientData.direcciones[0].calle,
            municipio: clientData.direcciones[0].municipio,
            provincia: clientData.direcciones[0].provincia,
            codigo_postal: clientData.direcciones[0].codigoPostal,
            pais: clientData.direcciones[0].pais
        }

        const updateOrder = await mongoose.connection.collection('clientes').updateOne(
            { 'cuenta.email': clientData.cuenta.email },
            {
                $push: {
                    pedidos: order
                }
            }
        );
        res.status(200).send({ code: 0, message: 'URL de PayPal obtenida', orderId: orderPaypal.id, orderClient: order._id });
    } catch (error) {
        res.status(200).send({ code: 9, message: 'Error en la creacion de orden' });
    }
})


shopRouter.post('/Capture/Payment/:orderId', async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const { clientData, id } = req.body;

        const capturaPago = await paypalService.CapturePaymentOfPaypal_2(orderId);
        console.log('Captura de pago: ', capturaPago);

        if (!capturaPago) throw new Error('No se pudo capturar el pago de PayPal.');

        const fecha = new Date();
        const fechaPago = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
        // Guardar el resto de datos de pago del cliente
        const updatePayData = await mongoose.connection.collection('clientes').updateOne(
            { _id: new mongoose.Types.ObjectId(id), 'pedidos.idOrderPaypal': orderId },
            {
                $set: {
                    'pedidos.$.metodoPago.info': {
                        estado: 'COMPLETADO',
                        capturaOrden: {
                            capturaId: capturaPago.id,
                            estadoCaptura: capturaPago.status,
                            'payment_source.paypal': {
                                account_id: capturaPago.payment_source.paypal.account_id,
                                name: {
                                    given_name: capturaPago.payment_source.paypal.name.given_name,
                                    surname: capturaPago.payment_source.paypal.name.surname
                                },
                                email_address: capturaPago.payment_source.paypal.email_address
                            },
                            payer: {
                                payer_id: capturaPago.payer.payer_id,
                                name: {
                                    given_name: capturaPago.payer.name.given_name,
                                    surname: capturaPago.payer.name.surname
                                },
                                email_address: capturaPago.payer.email_address
                            }
                        }
                    },
                    'pedidos.$.fechaPago': fechaPago,
                    'pedidos.$.fechaEnvio': fechaPago + 2,
                    'carrito.itemsPedido': []
                }
            });
        if (updatePayData.modifiedCount === 0) throw new Error('No se pudo actualizar los datos de pago del cliente.');
        //console.log('Actualización de datos de pago en cliente: ', updatePayData);

        res.status(200).send({ code: 0, message: 'Pago correcto', orderCapture: capturaPago });
    } catch (error) {
        console.log('Error en la captura de pago: ', error);
        res.status(200).send({ code: 10, message: 'No se pudo capturar el pago de PayPal' });
    }
})

shopRouter.post('/Persistencia/Agregar', async (req, res, next) => {
    try {
        const { client, order, quantity, gastosEnvio } = req.body;
        console.log(order, '--------', gastosEnvio);

        const find = await findProduct(client, order);

        let subtotalPrice = client.carrito.itemsPedido.reduce((total, item) => {
            const precio = item.producto.precio || 0;
            const cantidad = item.quantity || 0;
            return total + (precio * cantidad);
        }, 0);

        const nuevoItemPrecio = (order.price * quantity);
        subtotalPrice += nuevoItemPrecio;


        subtotalPrice = Math.round(subtotalPrice * 100) / 100;

        console.log('Subtotal: ', subtotalPrice);

        let updateData;
        if (find) {
            updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
                {
                    'cuenta.email': client.cuenta.email,
                    'carrito.itemsPedido.producto.nombre': order.nombre
                },
                {
                    $inc: {
                        'carrito.itemsPedido.$.quantity': quantity
                    },

                    $set: {
                        'carrito.gastosEnvio': gastosEnvio,
                        'carrito.subtotal': subtotalPrice,
                        'carrito.total': subtotalPrice + gastosEnvio
                    }
                },
                { returnDocument: "after" }
            );
            console.log('Cantidad actualizada: ', updateData);
        } else {
            updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
                {
                    'cuenta.email': client.cuenta.email,
                },
                {
                    $push: {
                        'carrito.itemsPedido': {
                            producto: order,
                            quantity
                        }
                    },
                    $set: {
                        'carrito.cuponDescuento': [],
                        'carrito.gastosEnvio': gastosEnvio,
                        'carrito.subtotal': subtotalPrice,
                        'carrito.total': subtotalPrice + gastosEnvio
                    }
                },
                { returnDocument: "after" }
            );
            console.log('Nuevo producto en carrito: ', updateData);
        }

        //if (!updateData) throw new Error('No se pudo actualizar los datos del carrito');

        res.status(200).send({ code: 0, message: 'Pedido introducido en la BBDD', data: updateData });
    } catch (error) {
        console.log('Error en persistencia: ', error)
        res.status(200).send({ code: 5, message: error });
    }
});


shopRouter.post('/Persistencia/Eliminar', async (req, res, next) => {
    try {
        const { client, order, quantity } = req.body;

        const find = findProduct(client, order);

        let deleteProductCart;
        if (find) {
            deleteProductCart = await mongoose.connection.collection('clientes').findOneAndUpdate(
                {
                    'cuenta.email': client.cuenta.email,
                },
                {
                    $pull: {
                        'carrito.itemsPedido': {
                            'producto.nombre': order.nombre,
                            quantity
                        }
                    }
                },
                { returnDocument: "after" }
            );
        }

        res.status(200).send({ code: 0, message: 'Producto eliminado del carrito', data: deleteProductCart })
    } catch (error) {
        console.log('Error en persistencia: ', error)
        res.status(200).send({ code: 6, message: error });
    }
});

shopRouter.post('/Persistencia/Actualizar', async (req, res, next) => {
    try {
        const { client, order, quantity } = req.body;

        const find = findProduct(client, order);

        let updateProductCart;
        if (find) {
            updateProductCart = await mongoose.connection.collection('clientes').findOneAndUpdate(
                {
                    'cuenta.email': client.cuenta.email,
                    'carrito.itemsPedido.producto.nombre': order.nombre
                },
                {
                    $set: {
                        'carrito.itemsPedido.$.quantity': quantity
                    }
                },
                { returnDocument: "after" }
            )
        }

        res.status(200).send({ code: 0, message: 'Producto actualizado en el carrito', data: updateProductCart });
    } catch (error) {
        console.log('Error en persistencia: ', error)
        res.status(200).send({ code: 7, message: error });
    }
});

shopRouter.get('/Categorias', async (req, res, next) => {
    try {

        const allCategories = await mongoose.connection.collection('categorias').find().toArray();

        if (!allCategories) throw new Error('No se pudieron encontrar las categorias');

        res.status(200).send({ code: 0, message: 'Categorias obtenidas', categories: allCategories });
    } catch (error) {
        res.status(200).send({ code: 8, message: error, categories: [] });
    }
});


module.exports = shopRouter;