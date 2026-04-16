
const requestInNode = {
    generateTokenPaypal: async () => {
        const request = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET_ID).toString("base64")
            },
            body: "grant_type=client_credentials"
        });
        //formato de la respuesta de paypal: https://developer.paypal.com/api/rest/#link-sampleresponse
        const response = await request.json();
        return response;
    },

    createOrderReq: async (bodyOrder, token) => {
        const request = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bodyOrder)
        });
        const response = await request.json();
        return response;
    },

    capturePaymentWithId: async (orderId, token) => {
        const request = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const response = await request.json();
        return response;
    }

}

export default requestInNode;