export const request_clients = {
    get_clients_with_orders: async () => {
        const requestClients = await fetch('http://localhost:3000/api/auth/get-orders');
        const responseClients = await requestClients.json();
        return responseClients;
    }
}