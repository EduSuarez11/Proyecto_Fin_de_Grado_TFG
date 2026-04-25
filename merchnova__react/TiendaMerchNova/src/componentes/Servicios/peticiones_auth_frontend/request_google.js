export const request_google = {
    // Peticion para login con Google
    loginGoogle: async () => {
        const request = await fetch(`http://localhost:3000/api/Cliente/Login-Google`, { method: 'GET' });
        const response = await request.json();
        return response;
    }
}
