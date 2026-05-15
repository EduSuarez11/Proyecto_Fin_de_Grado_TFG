const { Server } = require("socket.io");
const mongoose = require('mongoose');


const memoryStorage = new Map();

async function createChatAdmin(data) {
    // Realizar peticion al backend para actualizar el cliente admin y crear el chat en el admin en la base de datos

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

        // Enviar mensaje con la sala ya creada
        socket.on('sendMsg', async (data) => {
            const { salaId, mensaje, datosCliente, datosAdmin } = data;

            const session = memoryStorage.get(salaId);
            //console.log('Mensajes: ', mensaje);

            console.log(`NUEVO MENSAJE de [${mensaje.transmitterId}] para la [${salaId}]: ${mensaje.contenido} mandado en ${mensaje.timestamp}`);
            // Guardar el mensaje en la sesión correspondiente
            if (!memoryStorage.has(salaId)) {
                memoryStorage.set(salaId, { datosCliente, datosAdmin, messages: [mensaje] });

                const adminUpdate = await mongoose.connection.collection('clientes').findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(datosAdmin.idAdmin), 'chats._id': { $ne: salaId } },
                    {
                        $push: {
                            chats: {
                                _id: salaId,
                                datosCliente: {
                                    idCliente: new mongoose.Types.ObjectId(datosCliente.idCliente),
                                    nombreCliente: datosCliente.nombreCliente,
                                    imagenCuenta: datosCliente.imagenCuenta
                                },
                                datosAdmin: {
                                    idAdmin: new mongoose.Types.ObjectId(datosAdmin.idAdmin),
                                    nombreAdmin: datosAdmin.nombreAdmin,
                                    imagenCuenta: datosAdmin.imagenCuenta
                                },
                                mensajes: [
                                    // {
                                    //     contenido: 'Bienvenido al soporte técnico, ¿necesitas ayuda?. Aquí podrás resolver tus dudas.',
                                    //     timestamp: Date.now(),
                                    //     transmitterId: datosAdmin.idAdmin.toString()
                                    // }
                                ],
                                fechaInicioChat: Date.now()
                            }
                        }
                    },
                    { returnDocument: "after" }
                );

                io.emit(`notification_admin_${datosAdmin.idAdmin}`, {
                    salaId,
                    datosCliente,
                    datosAdmin,
                    firstMsg: mensaje
                });

                await mongoose.connection.collection('clientes').updateMany(
                    { 'chats._id': salaId },
                    { $push: { "chats.$.mensajes": mensaje } }
                );

            } else {
                memoryStorage.get(salaId).messages.push(mensaje);

                await mongoose.connection.collection('clientes').updateMany(
                    { 'chats._id': salaId },
                    { $push: { "chats.$.mensajes": mensaje } }
                );
            }

            io.to(salaId).emit('receiveMsg', JSON.stringify(data));
        });

        // El administrador se une a la sala del cliente
        socket.on('adminJoinRoom', async (data) => {
            const { keyChat, datosAdmin, datosCliente, firstMsg } = JSON.parse(data);

            if (memoryStorage.has(keyChat)) {
                console.log('Admin uniendose a la sala');
                socket.join(keyChat);
            }
        })

        socket.on('joinRoom', async (data) => {
            const { salaId } = JSON.parse(data);
            // Unir al cliente normal a la sala
            socket.join(salaId);
        })
    })
}