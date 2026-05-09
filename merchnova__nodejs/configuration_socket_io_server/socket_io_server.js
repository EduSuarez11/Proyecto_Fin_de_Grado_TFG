const { Server } = require("socket.io");
const mongoose = require('mongoose');

const memoryStorage = new Map();

async function getAdmins() {
    const admins = await mongoose.connection.collection('clientes').find({ 'cuenta.rol': 'ADMINISTRADOR' }).toArray();
    return admins;
}

module.exports = (serverNode) => {
    const io = new Server(serverNode,
        {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        }
    )

    io.on('connection', (socket) => {
        // Unir al cliente al chat
        socket.on('joinRoom', async (clientId) => {
            const keyChat = `sala-${clientId}`; // Nombre de la sala
            // Creación de la sala
            socket.join(keyChat);
            console.log('Cliente se ha conectado en la sala: ', keyChat);
            if (!memoryStorage.has(keyChat)) {
                // Obtener la lista de administradores de la base de datos
                const admins = await getAdmins();

                console.log('Administradores disponibles para asignar al cliente');

                // Asignar un administrador aleatorio
                const assignedAdmin = admins[Math.floor(Math.random() * admins.length)];
                const assignedAdminId = assignedAdmin._id.toString();

                const adminData = {
                    id: assignedAdminId,
                    nombre: assignedAdmin.nombreCompleto,
                    imagenCuenta: assignedAdmin.cuenta.imagenCuenta
                }

                socket.emit('assignedAdmin', JSON.stringify(adminData));
                memoryStorage.set(keyChat, { clientId, adminId: assignedAdminId, messages: [], adminData });

                const defaultMsg = {
                    contenido: 'Bienvenido al soporte técnico, ¿necesitas ayuda?. Aquí podrás resolver tus dudas.',
                    transmitterId: assignedAdminId,
                    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
                // Realizar el emit al cliente para que reciba el mensaje de bienvenida
                io.to(keyChat).emit('receiveMsg', JSON.stringify(defaultMsg));
            } else {
                const session = memoryStorage.get(keyChat);
                //console.log('Datos de la sesión encontrada para el cliente: ', session);

                const adminData = {
                    id: session.adminId,
                    nombre: session.adminData.nombre,
                    imagenCuenta: session.adminData.imagenCuenta
                }

                socket.emit('assignedAdmin', JSON.stringify(adminData));
                memoryStorage.set(keyChat, { clientId, adminId: session.adminId, messages: [], adminData });

            }
        });

        // Enviar mensaje con la sala ya creada
        socket.on('sendMsg', (data) => {
            const { keyChat, contenido, transmitterId, timestamp } = data;
            const session = memoryStorage.get(keyChat);

            console.log(`NUEVO MENSAJE de [${transmitterId}] para la sala [${keyChat}]: ${contenido}`);
            io.to(keyChat).emit('receiveMsg', JSON.stringify(data));
            //socket.emit('adminJoinRoom', keyChat);
            if (session) {
                const adminId = session.adminId;
                session.messages.push({ contenido, transmitterId, timestamp });
                console.log(`Avisando al admin ${adminId} que hay un mensaje nuevo en ${keyChat}`);

                io.emit(`notification_admin_${adminId}`, {
                    keyChat: keyChat,
                    ultimoMensaje: contenido,
                    clientId: session.clientId
                });
            }
            // socket.emit(`notification_admin_${session.adminId}`, {
            //     keyChat,
            //     transmitterId
            // });

        });

        // El administrador se une a la sala del cliente
        socket.on('adminJoinRoom', (keyChat) => {
            socket.join(keyChat);
            console.log('Administrador se ha unido a la sala de soporte: ', keyChat);

            const session = memoryStorage.get(keyChat);
            if (session && session.messages.length > 0 && session.messages.length <= 1) {
                console.log('Enviando historial de mensajes al administrador para la sala: ', keyChat);
                socket.emit('historyChat', JSON.stringify(session.messages));
            }
        })
    })
}