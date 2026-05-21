const { Server } = require("socket.io");
const mongoose = require('mongoose');


const memoryStorage = new Map();

async function setChatWithNewMessages(salaId, mensaje) {
    // Realizar peticion al backend para actualizar el cliente y admin con los nuevos mensajes
    await mongoose.connection.collection('clientes').updateMany(
        { 'chats._id': salaId },
        { $push: { "chats.$[chat].mensajes": mensaje } },
        { arrayFilters: [{'chat._id': salaId}]}
    );
}

module.exports = (serverNode) => {
    const io = new Server(serverNode,
        {
            cors: {
                origin: [process.env.URL_DOMAIN, process.env.URL_FRONTEND,'https://merchnova-web.onrender.com/'],
                methods: ['GET', 'POST']
            }
        }
    )

    io.on('connection', (socket) => {

        // Enviar mensaje con la sala ya creada
        socket.on('sendMsg', async (data) => {
            const { salaId, mensaje, datosCliente, datosAdmin } = data;

            const session = memoryStorage.get(salaId);

            console.log(`NUEVO MENSAJE de [${mensaje.transmitterId}] para la [${salaId}]: ${mensaje.contenido} mandado en ${mensaje.timestamp}`);
            // Guardar el mensaje en la sesión correspondiente
            if (!memoryStorage.has(salaId)) {
                memoryStorage.set(salaId, { datosCliente, datosAdmin, messages: [mensaje] });

                // Crear chat en el usuario administrador
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
                                fechaInicioChat: Date.now(),
                                fechaFinChat: null,
                                estado: 'ACTIVO'
                            }
                        }
                    },
                    { returnDocument: "after" }
                );

                io.emit('adminJoinRoom', JSON.stringify({
                    salaId,
                    datosCliente,
                    datosAdmin,
                    firstMsg: mensaje,
                    estado: adminUpdate.estado
                }));
                await setChatWithNewMessages(salaId, mensaje);

            } else {
                memoryStorage.get(salaId).messages.push(mensaje);
                await setChatWithNewMessages(salaId, mensaje);
                socket.to(salaId).emit('receiveMsg', JSON.stringify({ salaId, mensaje }));
            }
        });

        // El administrador se une a la sala del cliente
        socket.on('adminJoinRoom', async (data) => {
            const { keyChat, datosAdmin } = JSON.parse(data);

            if (memoryStorage.has(keyChat)) {
                console.log('Admin uniendose a la sala');
                socket.join(keyChat);
            }
        })

        // El usuario normal se une a la sala
        socket.on('joinRoom', async (data) => {
            const { salaId } = JSON.parse(data);
            // Unir al cliente normal a la sala
            socket.join(salaId);
        })
    })
}