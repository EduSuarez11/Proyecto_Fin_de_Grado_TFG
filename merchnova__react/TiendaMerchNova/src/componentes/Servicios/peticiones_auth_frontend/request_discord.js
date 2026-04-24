export const request_discord = {
    discord_url: async () => {
        const requestURL = await fetch('http://localhost:3000/api/auth/Url-Discord', { method: 'GET' });
        const response = await requestURL.json();
        return response;
    },

    request_login_discord: async (dataDiscord) => {
        console.log('Datos en objeto desde datadiscord: ', dataDiscord)
        const request = await fetch(`http://localhost:3000/api/auth/Data-Discord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataDiscord)
        });
        const response = await request.json();
        console.log('REspuesta desde peticion data discord: ', response);
        return response;
    },


    request_callback_discord: async (code) => {
        const requestDiscord = await fetch('http://localhost:3000/api/auth/DiscordCallback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const responseDiscord = await requestDiscord.json();
        return responseDiscord;
    }
}