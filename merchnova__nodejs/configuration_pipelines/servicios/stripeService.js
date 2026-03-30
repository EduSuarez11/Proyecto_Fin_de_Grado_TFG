const URL_STRIPE = 'https://api.stripe.com/v1';
async function requestToStripe({ bodyStripe }) {
    const requestClient = await fetch(`${URL_STRIPE}/customers`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.STRIPE_KEY}`
        },
        body: new URLSearchParams(bodyStripe)
    });

    return requestClient;
}

module.exports = {
    //https://api.stripe.com/v1
    // Pasar datos del cliente
    CreateStripeClient_1: async (nombreCompleto, email, direccionEnvio) => {

        let bodyStripe = {
            name: nombreCompleto,
            email: email,
            'address[line1]': direccionEnvio.calle,
            'address[city]': direccionEnvio.municipio,
            'address[state]': direccionEnvio.provincia,
            'address[country]': direccionEnvio.pais,
            'address[postal_code]': direccionEnvio.codigoPostal
        }

        try {
            const response = requestToStripe(bodyStripe);

            if (!/^(2[0-2][0-9]|226)$/.test(response.status)) throw new Error('Error al realizar la petición de crear cliente');

            return responseCustomer.id;
        } catch (error) {
            console.log('Error al obtener id cliente: ', error);
            return null;
        }
    },

    // Pasar el id de cliente que se genera y los datos de la tarjeta
    CreateCard_2: (idClient, cardDetails) => {

    },

    // Cobrar al cliente pasandole el id de cliente, id tarjeta (paso 2), cantidad total y el id de pedido
    ChargeClient_3: (idClient, idCard, quantity, idOrder) => {

    }
}