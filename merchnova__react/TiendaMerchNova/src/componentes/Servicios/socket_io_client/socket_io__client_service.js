import { io, Socket } from 'socket.io-client'

export default {
    connectionServer: io('http://localhost:3000'),

    sendMessage: function (eventName, data) {
        console.log('Enviado la siguiente info: ', data);
        // Enviamos la información al servidor
        this.connectionServer.emit(eventName, data);
    },

    getMessage: function (nombreEvento, funcionHandler) {
        //if (this.connectionServer.hasListeners()) {
            console.log('Configurando recepción de mensajes del servidor de socket.io para el evento:', nombreEvento, 'con funcion handler:', funcionHandler);
            this.connectionServer.on(nombreEvento, funcionHandler);

        //}
    },

    adminListen: function (adminId) {
        this.connectionServer.on(`notification_admin_${adminId}`, (data) => {
            console.log('Nuevo cliente desde admin: ', data.keyChat);
            this.connectionServer.emit('adminJoinRoom', data.keyChat)
        })
    },

    joinRoom(clientId) {
        this.connectionServer.emit('joinRoom', clientId);
    },

    listenMessages(callback) {
        this.connectionServer.on('receiveMsg', callback);
    }
}