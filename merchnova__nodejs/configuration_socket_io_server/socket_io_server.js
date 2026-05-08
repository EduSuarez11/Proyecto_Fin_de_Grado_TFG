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
                const assignedAdminId = admins[Math.floor(Math.random() * admins.length)]._id.toString();

                memoryStorage.set(keyChat, { clientId, adminId: assignedAdminId });

                const defaultMsg = {
                    contenido: 'Bienvenido al soporte técnico, ¿necesitas ayuda?. Aquí podrás resolver tus dudas.',
                    transmitterId: assignedAdminId,
                    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
                //io.to(keyChat).emit('receiveMsg', defaultMsg);

                // socket.emit(`notification_admin_${assignedAdminId}`, {
                //     keyChat,
                //     clientId
                // });

            }
        });

        // Enviar mensaje con la sala ya creada
        socket.on('sendMsg', (data) => {
            const { keyChat, contenido, transmitterId, timestamp } = data;
            io.to(keyChat).emit('receiveMsg', data);
            console.log(`Mensaje para la sala ${keyChat}: ${contenido}`);
        });

        // El administrador se une a la sala del cliente
        socket.on('adminJoinRoom', (keyChat, adminId) => {
            socket.join(keyChat);
            console.log('Administrador se ha unido a la sala de soporte: ', keyChat);
            socket.emit(`notification_admin_${adminId}`, {
                keyChat,
                clientId: memoryStorage.get(keyChat)?.clientId
            });
        })
    })
}