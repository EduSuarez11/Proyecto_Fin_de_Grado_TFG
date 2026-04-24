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
    }
}
