export const request_google = {
    verification_recaptcha: async (URL_RECAPTCHA, requestVerification) => {
        const requestRecaptcha = await fetch(URL_RECAPTCHA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestVerification)
        });

        const responseRecaptcha = await requestRecaptcha.json();

        return responseRecaptcha
    }
}

export const request_discord = {
    user_api_discord: async (token) => {
        const requestData = await fetch('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const dataUser = await requestData.json();
        return dataUser;
    },

    token_api_discord: async (params) => {
        const requestApiDiscord = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const responseApiDiscord = await requestApiDiscord.json();
        return responseApiDiscord;
    }
}
