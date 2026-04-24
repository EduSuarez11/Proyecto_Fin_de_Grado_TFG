export const request_auth = {
    request_login: async (form) => {
        const requestLogin = await fetch('http://localhost:3000/api/auth/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const response = await requestLogin.json();
        return response;
    },

    request_register: async (formRegistro) => {
        const response = await fetch('http://localhost:3000/api/auth/Registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formRegistro)
        });

        const data = await response.json();
    },

    request_update: async (formProfile) => {
        const requestNewData = await fetch('http://localhost:3000/api/auth/Perfil-Update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formProfile)
        });

        const responseNewData = await requestNewData.json();
        return responseNewData;
    }
}


export const request_get_token = {
    token_verify: async (token) => {
        const request = await fetch(`http://localhost:3000/api/auth/Verify/Token`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const response = await request.json();
        return response;
    }
}