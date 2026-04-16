const { default: requestInNode } = require("./fetch/requestNode");

let tokenAccessPaypal = {
    token: null,
    expiration: null
}

async function getToken() {
    try {
        if (tokenAccessPaypal.token && tokenAccessPaypal.expiration) return tokenAccessPaypal.token;

        const { access_token, expires_in } = await requestInNode.generateTokenPaypal();
        if (!access_token && !expiration) throw new Error('No se pudo crear el token de acceso de PayPal.');

        tokenAccessPaypal.token = access_token;
        tokenAccessPaypal.expiration = Date.now() + (expires_in - 300) * 1000;

        console.log('Token: ', tokenAccessPaypal);
        return tokenAccessPaypal;
    } catch (error) {
        console.log('Error al crear el token paypal: ', error);
    }
}

module.exports = {

    CreateOrderPaypal_1: async (clientData, order) => {
        try {
            const { token } = await getToken();
            const subtotal = clientData === null ? null : clientData.carrito.itemsPedido.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);

            console.log('items: ', clientData.carrito.itemsPedido)
            const bodyOrder = {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: clientData.carrito.itemsPedido.map(item => (
                            {
                                name: item.producto.nombre,
                                quantity: item.quantity.toString(),
                                unit_amount: {
                                    currency_code: 'EUR',
                                    value: Math.round(item.producto.precio * 100) / 100
                                }
                            }
                        )),
                        amount: {
                            currency_code: 'EUR',
                            value: Math.round((subtotal + order.gastosEnvio) * 100) / 100,

                            breakdown: {
                                item_total: {
                                    currency_code: 'EUR',
                                    value: subtotal.toFixed(2)
                                },
                                shipping: {
                                    currency_code: 'EUR',
                                    value: order.gastosEnvio.toFixed(2)
                                }
                            }
                        }
                    }
                ],

                payment_source: {
                    paypal: {
                        experience_context: {
                            return_url: 'http://localhost:3000/api/checkout/success',
                            cancel_url: 'http://localhost:3000/api/checkout/success'
                        }
                    }
                }


            }

            const responseOrder = await requestInNode.createOrderReq(bodyOrder, token);
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
            const token = await getToken();
            console.log('Id de orden: ', orderId, ' y token: ', token);
            const responsePayment = await requestInNode.capturePaymentWithId(orderId, token);

            console.log('Captura de pago: ', responsePayment);
            if (!responsePayment) throw new Error('No se pudo crear la captura de pago.');

            return responsePayment;
        } catch (error) {
            console.log('Error al crear la captura de pago: ', error);
            return null;
        }

    }
}