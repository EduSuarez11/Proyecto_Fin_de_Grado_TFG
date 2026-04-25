// Modulo de código que realizará peticiones fetch para evitar repetir código en algunas ocasiones

const request_external = {
    // Petición para obtener todos los países del mundo
    request_get_countries: async () => {
        const requestCountries = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
        const responseCountries = await requestCountries.json();
        //console.log('Paises: ', responseCountries);
        return responseCountries;
    }
}

export default request_external;