const express = require('express');
const mongoose = require('mongoose');
const paypalService = require('../../servicios/paypalService');
const stripe = require('stripe')(process.env.STRIPE_KEY);
//const stripeService = require('../servicios/stripeService');

const manage_payment = express.Router();


manage_payment.post('/create-intent', async (req, res, next) => {
    try {
        const { clientData, direccionEnvio } = req.body;
        console.log('Datos de create intent ', req.body);
        let clientSecret;
        let paymentIntent;
        clientData.carrito._id = new mongoose.Types.ObjectId();


        const customer = await stripe.customers.create({
            name: clientData.nombreCompleto,
            email: clientData.cuenta.email,
        });

        const payment_intent = await stripe.paymentIntents.create({
            'amount': Math.round(clientData.carrito.total * 100),
            'currency': 'eur',
            'customer': customer.id,
            //'description': `MerchNova - Pago realizado con éxito. Pedido con identificador ${clientData.carrito._id} y cantidad total ${clientData.carrito.total}. `,
            'automatic_payment_methods': {
                'enabled': true
            }
            // 'metadata': {
            //     orderId: clientData.carrito._id.toString()
            // }
        });

        clientSecret = payment_intent.client_secret;

        if (!payment_intent.client_secret) throw new Error('No se pudo obtener el cliente secreto');

        res.status(200).send({ code: 0, message: 'Pasos de stripe completados', clientSecret });
    } catch (error) {
        console.log('Error en la peticion middleware: ', error);
        res.status(200).send({ code: 4, message: error.message });
    }
});

manage_payment.post('/order-update', async (req, res, next) => {
    try {
        const { clientData, order, direccionEnvio } = req.body;
        console.log('Datos para actualización de orden: ', req.body);

        // FECHA DE PAGO Y ENTREGA
        const fecha = new Date();
        const fechaPago = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        const fechaEnvio = `${fecha.getDate() + 2}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        // CREAR UN ID DEL PEDIDO Y AÑADIR OTROS DATOS AL PEDIDO
        order._id = new mongoose.Types.ObjectId();
        order.metodoPago = {
            tipo: 'Tarjeta',
            info: {
                estado: 'COMPLETADO',
            }
        };
        order.items = clientData.carrito.itemsPedido;
        order.subtotal = clientData.carrito.subtotal;
        order.total = clientData.carrito.total;
        order.estado = 'COMPLETED';
        order.direccionEnvio = {
            domicilio: direccionEnvio.domicilio,
            municipio: direccionEnvio.municipio,
            provincia: direccionEnvio.provincia,
            codigo_postal: direccionEnvio.codigoPostal,
            pais: direccionEnvio.pais
        }
        order.direccionFacturacion = {
            domicilio: clientData.direcciones[0].domicilio,
            municipio: clientData.direcciones[0].municipio,
            provincia: clientData.direcciones[0].provincia,
            codigo_postal: clientData.direcciones[0].codigoPostal,
            pais: clientData.direcciones[0].pais
        }

        const newPayData = await mongoose.connection.collection('clientes').updateOne(
            { _id: new mongoose.Types.ObjectId(clientData._id) },
            { $push: { pedidos: order } }
        )

        if (newPayData.modifiedCount === 0) throw new Error('No se pudieron actualizar los datos');

        const updatePayData = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(clientData._id), 'pedidos._id': order._id },
            {
                $set: {
                    'pedidos.$.fechaPago': fechaPago,
                    'pedidos.$.fechaEnvio': fechaEnvio,
                    'carrito.itemsPedido': [],
                    'carrito.subtotal': 0,
                    'carrito.gastosEnvio': 0,
                    'carrito.total': 0,
                }
            },
            { returnDocument: 'after' }
        )

        res.status(200).send({ code: 0, message: 'Orden actualizada correctamente', newUser: updatePayData, orderId: order._id });
    } catch (error) {
        console.log('Error al actualizar la orden: ', error);
        res.status(200).send({ code: 11, message: 'No se pudo actualizar la orden' });
    }
});

// CREAR ORDEN DE PAYPAL Y GUARDAR LOS DATOS DE LA ORDEN EN LA BASE DE DATOS
manage_payment.post('/Create/Order', async (req, res, next) => {
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
        order.estado = 'EN_CURSO';
        order.direccionEnvio = {
            domicilio: direccionEnvio.domicilio,
            municipio: direccionEnvio.municipio,
            provincia: direccionEnvio.provincia,
            codigo_postal: direccionEnvio.codigoPostal,
            pais: direccionEnvio.pais
        }
        order.direccionFacturacion = {
            domicilio: clientData.direcciones[0].domicilio,
            municipio: clientData.direcciones[0].municipio,
            provincia: clientData.direcciones[0].provincia,
            codigo_postal: clientData.direcciones[0].codigoPostal,
            pais: clientData.direcciones[0].pais
        }


        // Comprobar si existe un pedido existente para evitar crear pedidos "basura"
        const orderExist = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': clientData.cuenta.email, 'pedidos.metodoPago.info.estado': 'PENDIENTE' })
        console.log('Pedido existente: ', orderExist);
        if (!orderExist) {
            // Si no existe, crear el pedido en estado "PENDIENTE"
            const updateOrder = await mongoose.connection.collection('clientes').updateOne(
                { 'cuenta.email': clientData.cuenta.email },
                { $push: { pedidos: order } }
            );
        } else {
            // Si existe, continuar con ese pedido y actualizar los campos que posiblemente podrian haber cambiado.
            const pendingOrder = orderExist.pedidos.find(pedido => pedido.metodoPago.info.estado === 'PENDIENTE');
            //console.log('Pedido pendiente: ', pendingOrder);
            await mongoose.connection.collection('clientes').updateOne(
                { 'cuenta.email': clientData.cuenta.email, 'pedidos._id': pendingOrder._id },
                {
                    $set: {
                        'pedidos.$.items': order.items,
                        'pedidos.$.subtotal': order.subtotal,
                        'pedidos.$.gastosEnvio': order.gastosEnvio,
                        'pedidos.$.total': order.total,
                        'pedidos.$.direccionEnvio': order.direccionEnvio
                    }
                }
            );
        }

        res.status(200).send({ code: 0, message: 'URL de PayPal obtenida', orderId: orderPaypal.id, orderClient: order._id });
    } catch (error) {
        console.log('Error: ', error);
        res.status(200).send({ code: 9, message: 'Error en la creacion de orden' });
    }
})


// CAPTURAR EL PAGO DE PAYPAL Y GUARDAR LOS DATOS DE LA CAPTURA EN LA BASE DE DATOS
manage_payment.post('/Capture/Payment/:orderId', async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const { clientData, id } = req.body;

        console.log('Datos para captura de pago: ', req.body);
        console.log('Id de pedido: ', orderId, ' y Id de pedido: ', id);

        const capturaPago = await paypalService.CapturePaymentOfPaypal_2(orderId);
        console.log('Captura de pago: ', capturaPago);

        if (!capturaPago) throw new Error('No se pudo capturar el pago de PayPal.');

        // Verificar que el pago se completó correctamente
        if (capturaPago.status !== 'COMPLETED') {
            throw new Error(`El pago no se completó. Estado: ${capturaPago.status}`);
        }

        const fecha = new Date();
        const fechaPago = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        const fechaEnvio = `${fecha.getDate() + 2}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        // Guardar el resto de datos de pago del cliente
        const updatePayData = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(clientData._id), 'pedidos._id': new mongoose.Types.ObjectId(id) },
            {
                $set: {
                    'pedidos.$.metodoPago.info': {
                        estado: 'COMPLETADO',
                        capturaOrden: {
                            capturaId: capturaPago.id,
                            estadoCaptura: capturaPago.status,
                            payment_source: {
                                paypal: {
                                    account_id: capturaPago.payment_source.paypal.account_id,
                                    name: {
                                        given_name: capturaPago.payment_source.paypal.name.given_name,
                                        surname: capturaPago.payment_source.paypal.name.surname
                                    },
                                    email_address: capturaPago.payment_source.paypal.email_address
                                }
                            },
                            payer: {
                                payer_id: capturaPago.payer.payer_id,
                                name: {
                                    given_name: capturaPago.payer.name.given_name,
                                    surname: capturaPago.payer.name.surname
                                },
                                email_address: capturaPago.payer.email_address
                            },
                        }
                    },
                    'pedidos.$.estado': 'COMPLETADO',
                    'pedidos.$.fechaPago': fechaPago,
                    'pedidos.$.fechaEnvio': fechaEnvio,
                    'carrito.itemsPedido': [],
                    'carrito.subtotal': 0,
                    'carrito.gastosEnvio': 0,
                    'carrito.total': 0,
                }
            },
            { returnDocument: 'after' }
        );

        // const updateProductStock = await mongoose.connection.collection('productos').updateMany(
        //     { _id: { $in: clientData.carrito.itemsPedido.map(item => new mongoose.Types.ObjectId(item._id)) } },
        //     { $inc: { stock: -1 } }
        // );

        console.log('Actualización de datos de pago en cliente: ', updatePayData);
        if (updatePayData.modifiedCount === 0) throw new Error('No se pudo actualizar los datos de pago del cliente.');

        res.status(200).send({ code: 0, message: 'Pago correcto', orderCapture: capturaPago, newUser: updatePayData });
    } catch (error) {
        console.log('Error en la captura de pago: ', error);
        res.status(200).send({ code: 10, message: 'No se pudo capturar el pago de PayPal' });
    }
})

module.exports = manage_payment;
