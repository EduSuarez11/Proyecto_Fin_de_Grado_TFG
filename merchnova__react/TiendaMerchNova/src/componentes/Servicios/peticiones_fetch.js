// Modulo de código que realizará peticiones fetch para evitar repetir código en algunas ocasiones

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

    requestGetProductsByFilter: async(dataFilter) => {
        const request = await fetch('http://localhost:3000/api/Tienda/FiltrarProductos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataFilter)
        });
        const response = await request.json();

        return response;
    }
}

export default requestFetch;