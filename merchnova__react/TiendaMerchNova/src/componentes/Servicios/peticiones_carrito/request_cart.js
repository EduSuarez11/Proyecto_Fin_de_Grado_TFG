export const request_cart = {
    // Peticion para carrito con persistencia
    cart_persistence: async ({ clientData, order, quantity, gastosEnvio }, route) => {
        const request = await fetch(`http://localhost:3000/api/cart/Persistencia${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client: clientData, order, quantity, gastosEnvio })
        });

        const response = await request.json();
        return response;
    }
}


