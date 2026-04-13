const { default: requestInNode } = require("./fetch/requestNode");

let tokenAccessPaypal = {
    token: null,
    expiration: null
}

async function getToken() {
    try {
        if (tokenAccessPaypal.token && tokenAccessPaypal.expiration) return tokenAccessPaypal.token;

        const { access_token, expiration } = await requestInNode.generateTokenPaypal();
        if (!access_token && !expiration) throw new Error('No se pudo crear el token de acceso de PayPal.');

        tokenAccessPaypal.token = access_token;
        tokenAccessPaypal.expiration = Date.now() + (expiration - 100) * 1000;

        console.log('Token: ', tokenAccessPaypal);
        return tokenAccessPaypal;
    } catch (error) {
        console.log('Error al crear el token paypal: ', error);
    }
}

module.exports = {

    CreateOrderPaypal_1: async (clientData, order) => {
        try {
            const accessToken = await getToken();
            const subtotal = clientData === null ? null : clientData.carrito.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);
            const bodyOrder = {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: clientData.carrito.map(item => (
                            {
                                name: item.producto.nombre,
                                description: item.producto.descripcion,
                                quantity: item.quantity.toString(),
                                category: item.producto.categoria,
                                unit_amount: {
                                    currency_code: 'EUR',
                                    value: Math.round(item.producto.precio * 100) / 100
                                }
                            }
                        )), //<---- array de items de pedidos a desplegar en la pasarela de paypal cuando se procese el pago
                        //OJO!!! la suma del producto de la cantidad por el valor del precio de cada item debe coincidir con el valor total del order
                        amount: {
                            currency_code: 'EUR',
                            value: subtotal + order.gastosEnvio,

                            breakdown: {
                                item_total: {
                                    currency_code: 'EUR',
                                    value: subtotal.toFixed(2)
                                },
                                shipping: {
                                    currency_code: 'EUR',
                                    value: order.gastosEnvio.toFixed(2)
                                } //<---gastos de envio
                            }
                        }
                    }
                ],

            }

            const responseOrder = await requestInNode.createOrderReq(bodyOrder, accessToken);
            console.log("Datos de la orden de PayPal:", responseOrder);

            if (!responseOrder) throw new Error('No se pudo realizar la creacion de orden de pago.');

            return responseOrder;
        } catch (error) {
            console.log('Error al crear la orden de pago: ', error);
            return null;
        }
    },

    CapturePaymentOfPaypal_2: async (orderId) => {
        try {
            const accessToken = await getToken();
            const responsePayment = await requestInNode.capturePaymentWithId(orderId, accessToken);

            console.log('Captura de pago: ', responsePayment);
            if (!responsePayment) throw new Error('No se pudo crear la captura de pago.');

            return responsePayment;
        } catch (error) {
            console.log('Error al crear la captura de pago: ', error);
            return null;
        }

    }
}