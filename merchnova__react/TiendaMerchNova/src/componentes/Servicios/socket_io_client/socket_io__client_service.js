import { io, Socket } from 'socket.io-client'

export default {
    connectionServer: io('http://localhost:3000'),

    sendMessage: function (eventName, data) {
        // Enviamos la información al servidor
        this.connectionServer.emit(eventName, data);
    },

    getMessage: function (nombreEvento, funcionHandler) {
        if (this.connectionServer.hasListeners()) return;
        this.connectionServer.on(nombreEvento, funcionHandler);
    },


    listenMessages: function (callback) {
        //this.connectionServer.off('receiveMsg');
        this.connectionServer.on('receiveMsg', (data) => {
            //console.log('Recibiendo mensaje del servidor de socket.io');
            const message = JSON.parse(data);
            callback(message);
        });
    },

    getHistoryChat: function (callback) {
        this.connectionServer.on('historyChat', (data) => {
            const messages = JSON.parse(data);
            callback(messages);
        });
    },
}