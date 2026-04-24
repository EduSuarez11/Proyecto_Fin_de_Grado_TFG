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
        //console.log('Paises: ', responseCountries);
        return responseCountries;
    },

    

    getClientStripe: async (clientData, type, direccionEnvio) => {
        const request = await fetch(`${URL_TIENDA}/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clientData, type, direccionEnvio })
        });

        const response = await request.json();
        return response;
    }


}

export default requestFetch;