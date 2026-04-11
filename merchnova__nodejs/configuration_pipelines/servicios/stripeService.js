const URL = 'https://api.stripe.com/v1';
const stripe = require('stripe')(process.env.STRIPE_KEY);

async function requestToStripe({ body }, URL_STRIPE) {
    const requestStripe = await fetch(`${URL_STRIPE}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.STRIPE_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(body)
    });
    

    if (!/^(2[0-2][0-9]|226)$/.test(requestStripe.status.toString())) throw new Error(`Error al realizar la petición, codigo: ${requestStripe.status}. Vuelve a intentarlo`);

    const responseStripe = requestStripe.json();

    return responseStripe;
}


module.exports = {
    //https://api.stripe.com/v1
    // Pasar datos del cliente
    CreateStripeClient_1: async (nombreCompleto, email, direccionEnvio) => {
        try {
            let bodyStripe = {
                name: nombreCompleto,
                email: email,
                'address[line1]': direccionEnvio.calle,
                'address[city]': direccionEnvio.municipio,
                'address[state]': direccionEnvio.provincia,
                'address[country]': direccionEnvio.pais,
                'address[postal_code]': direccionEnvio.codigoPostal
            }

            console.log('BodyStripe: ', bodyStripe);

            const response = await requestToStripe(bodyStripe, URL + '/customers');
            console.log('Respuesta de stripe (client): ', response);
            return response.id;
        } catch (error) {
            console.log('Error al obtener id cliente: ', error);
            return null;
        }
    },

    // Pasar el id de cliente que se genera y los datos de la tarjeta
    CreateCard_2: async (idClient, cardDetails) => {
        try {
            let bodyCard = {
                'source': 'visa'
                // 'card[number]': cardDetails.cardNumber,
                // 'card[exp_year]': cardDetails.yearExp,
                // 'card[exp_month]': cardDetails.monthExp,
                // 'card[cvc]': cardDetails.cvc
            }

            const response = await requestToStripe(bodyCard, `${URL}/customers/${idClient}/sources`)
            console.log('Respuesta de stripe (card): ', response);
            return response.id;
        } catch (error) {
            console.log('Error al realizar la peticion de Crear Card: ', error);
            return null;
        }

    },

    // Cobrar al cliente pasandole el id de cliente, id tarjeta (paso 2), cantidad total y el id de pedido
    // payment_intent
    ChargeClient_3: async (idClient, idCard, totalQty, idOrder) => {
        try {
            const bodyCharge = {
                'amount': totalQty * 100,
                'currency': 'eur',
                'customer': idClient,
                'description': `MerchNova - Pago realizado con éxito. Pedido con identificador ${idOrder} y cantidad total ${totalQty}. `,
                'payment_method': idCard,
                'confirm': 'true',
                'automatic_payment_methods[enabled]': true,
                'automatic_payment_methods[allowed_payment_method_types]': ['card', 'paypal']
            }

            const response = await requestToStripe(bodyCharge, `${URL}/payment_intents`);
            console.log('Respuesta del cargo: ', response);

            return response.id;

        } catch (error) {
            console.log('Error al realizar la peticion de cobro: ', error);
            return null;
        }
    }
}