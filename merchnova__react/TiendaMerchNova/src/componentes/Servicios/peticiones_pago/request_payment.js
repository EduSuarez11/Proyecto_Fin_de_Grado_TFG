export const request_stripe = {
    get_client_stripe: async (clientData, direccionEnvio) => {
        const request = await fetch(`http://localhost:3000/api/pay/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clientData, direccionEnvio })
        });

        const response = await request.json();
        return response;
    },

    update_order: async (clientData, order, direccionEnvio) => {
        const request = await fetch(`http://localhost:3000/api/pay/order-update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientData, order, direccionEnvio })
        });

        const response = await request.json();
        return response;
    }
}

export const request_paypal = {
    create_order: async (clientData, order, direccionEnvio) => {
        const requestOrder = await fetch('http://localhost:3000/api/pay/Create/Order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientData, order, direccionEnvio })
        });

        const responseOrder = await requestOrder.json();
        return responseOrder;
    },

    approve_payment: async (clientData, orderClient, orderId) => {
        const requestCapture = await fetch(`http://localhost:3000/api/pay/Capture/Payment/${orderId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientData, id: orderClient.toString() })
        });
        const responseCapture = await requestCapture.json();
        return responseCapture;
    }

}