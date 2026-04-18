const URL_TIENDA = 'http://localhost:3000/api/Tienda';
const URL_CLIENTE = 'http://localhost:3000/api/Cliente';

const request_login_discord = {
    RequestLoginDiscord: async ( dataDiscord ) => {
        console.log('Datos en objeto desde datadiscord: ', dataDiscord)
        const request = await fetch(`${URL_CLIENTE}/DataDiscord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( dataDiscord )
        });
        const response = await request.json();
        console.log('REspuesta desde peticion data discord: ', response);
        return response;
    },


    RequestCallbackDiscord: async (code) => {
        const requestDiscord = await fetch('http://localhost:3000/api/Cliente/DiscordCallback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const responseDiscord = await requestDiscord.json();
        return responseDiscord;
    }
}
export default request_login_discord;