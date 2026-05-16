import { io, Socket } from 'socket.io-client'

export default {
    connectionServer: io('http://localhost:3000'),

    sendMessage: function (eventName, data) {
        // Enviamos la información al servidor
        this.connectionServer.emit(eventName, data);
    },

    receiveEvent: function (nombreEvento, funcionHandler) {
        if (this.connectionServer.hasListeners()) return;
        this.connectionServer.on(nombreEvento, funcionHandler);
    },


    listenMessages: function (callback) {
        //this.connectionServer.off('receiveMsg');
        this.connectionServer.on('receiveMsg', (data) => {
            console.log('Recibiendo mensaje del servidor de socket.io');
            const message = JSON.parse(data);
            callback(message);
        });
    },

    joinRoom: function (data) {
        this.connectionServer.emit('joinRoom', JSON.stringify(data));
    },

    adminListen: function(adminId, callback) {
        this.connectionServer.on(`notification_admin_${adminId}`, callback);
    },

    closeEvent: function (setData) {
        this.connectionServer.off('receiveMsg', setData);
    }
}