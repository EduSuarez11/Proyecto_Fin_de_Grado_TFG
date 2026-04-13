// Modulo de código que realizará peticiones fetch para evitar repetir código en algunas ocasiones

const URL_TIENDA = 'http://localhost:3000/api/Tienda';
const URL_CLIENTE = 'http://localhost:3000/api/Cliente';

const requestFetch = {
    // Petición para obtener todos los países del mundo
    requestGetCountries: async () => {
        const requestCountries = await fetch('https://restcountries.com/v3.1/all?fields=name,flags',
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        const responseCountries = await requestCountries.json();
        console.log('Paises: ', responseCountries);
        return responseCountries;
    },


    // Peticion para obtener los productos por filtro
    requestGetProductsByFilter: async (dataFilter, priceFilter) => {
        const request = await fetch(`${URL_TIENDA}/FiltrarProductos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataFilter, priceFilter })
        });
        const response = await request.json();

        return response;
    },


    // Peticion para carrito con persistencia
    cartPersistence: async ({ clientData, order, quantity }, route) => {
        const request = await fetch(`${URL_TIENDA}/Persistencia${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client: clientData, order, quantity })
        });

        const response = await request.json();
        return response;
    },

    // Peticion para login con Google
    loginGoogle: async () => {
        const request = await fetch(`${URL_CLIENTE}/LoginGoogle`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const response = await request.json();
        return response;
    },

    getCategories: async () => {
        const request = await fetch(`${URL_TIENDA}/Categorias`);
        const response = await request.json();
        console.log(response);
        return response;
    },

}

export default requestFetch;