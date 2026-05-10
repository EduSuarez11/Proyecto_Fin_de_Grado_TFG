import { io, Socket } from 'socket.io-client'

export default {
    connectionServer: io('http://localhost:3000'),

    sendMessage: function (eventName, data) {
        //console.log('Enviado la siguiente info: ', data);
        // Enviamos la información al servidor
        this.connectionServer.emit(eventName, data);
    },

    getMessage: function (nombreEvento, funcionHandler) {
        //if (this.connectionServer.hasListeners()) {
            //console.log('Configurando recepción de mensajes del servidor de socket.io para el evento:', nombreEvento, 'con funcion handler:', funcionHandler);
            this.connectionServer.on(nombreEvento, funcionHandler);

        //}
    },

    adminListen: function (adminId, setRoom, setChatList) {
        this.connectionServer.on(`notification_admin_${adminId}`, (data) => {
            //console.log('Nuevo cliente desde admin: ', data.keyChat);
            setRoom(data.keyChat);
            setChatList((oldData) => {
                // Comprobamos si el chat ya existe en nuestra lista para no duplicar
                const index = oldData?.find(chat => chat?.sala === data.keyChat);
                console.log('Datos antiguos: ', oldData);
                
                if (!index) {
                    const chat = {
                        sala: data.keyChat,
                        datosCliente: data.dataClient,
                        timestamp: data.timestamp,
                        mensajes: data.ultimoMensaje
                    };
                    return [...oldData, chat];
                }
                return oldData;
            });
            this.connectionServer.emit('adminJoinRoom', data.keyChat);
        })
    },

    joinRoom: function(clientId) {
        this.connectionServer.emit('joinRoom', clientId);
    },

    listenMessages: function(callback) {
        //this.connectionServer.off('receiveMsg');
        this.connectionServer.on('receiveMsg', (data) => {
            //console.log('Recibiendo mensaje del servidor de socket.io');
            const message = JSON.parse(data);
            callback(message);
        });
    },

    getHistoryChat: function(callback) {
        this.connectionServer.on('historyChat', (data) => {
            const messages = JSON.parse(data);
            callback(messages);
        });
    },

    getDataAdmin: function(callback) {
        this.connectionServer.on('assignedAdmin', (data) => {
            const adminData = JSON.parse(data);
            callback(adminData);
        });
    }
}