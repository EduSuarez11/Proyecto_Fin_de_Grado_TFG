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
    }

    
}

export default requestFetch;