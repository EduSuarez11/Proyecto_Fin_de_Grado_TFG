export const request_profile = {
    add_new_direction: async ({ clientData, data }) => {
        const request = await fetch(`http://localhost:3000/api/profile/NewDirection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientData, data })
        });

        const response = await request.json();
        return response;
    },

    remove_direction: async (clientData, direccion) => {
        const request = await fetch(`http://localhost:3000/api/profile/Remove-Direction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientData, direccion })
        });
        const response = await request.json();
        return response;
    },

    set_data_profile: async (email) => {
        const requestNewData = await fetch(`http://localhost:3000/api/profile/ForgotPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email)
        });

        const responseNewData = await requestNewData.json();
        return responseNewData;
    },

    set_new_password: async (formPassword) => {
        const requestNewPassword = await fetch(`http://localhost:3000/api/profile/ResetPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formPassword)
        });

        const responseNewPassword = await requestNewPassword.json();
        return responseNewPassword;
    },

    request_set_privacity: async (clientData, privacity) => {
        const requestUpdateData = await fetch('http://localhost:3000/api/profile/ChangeVisibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientData, privacity })
        });

        const responseUpdateData = await requestUpdateData.json();
        return responseUpdateData;
    },

    request_create_chat: async (newChat) => {
        const requestCreateChat = await fetch('http://localhost:3000/api/profile/CreateChat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newChat)
        });
        const responseCreateChat = await requestCreateChat.json();
        return responseCreateChat;
    }
}
