const messageEmail = (data, url) => `
    <h1>Hola ${data.nombre}, un placer conocerte.</h1>
    <p>Gracias por registrarte en MerchNova. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
    <a href="${url}">Activar mi cuenta</a>
    <p>Si no te has registrado en nuestro sitio web, puedes ignorar este correo electrónico.</p>
    <p>Saludos,</p>
    <p>Asistencia de MerchNova</p>
    <hr>
    <img src="cid:id-logoMN" alt="Logo de MerchNova" width="300">
`

module.exports = {

    sendEmail: async (clientData) => {
        //const token = '';
        const EnlaceActivacion = `http://localhost:3000/api/Cliente/ActivarCuenta?token=${token}`
        
    }
}