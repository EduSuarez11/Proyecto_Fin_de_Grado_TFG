const { Server } = require("socket.io");
const mongoose = require('mongoose');

const memoryStorage = new Map();

async function getAdmins() {
    const admins = await mongoose.connection.collection('clientes').find({ 'cuenta.rol': 'ADMINISTRADOR' }).toArray();
    return admins;
}

async function getClientById(clientId) {
    const client = await mongoose.connection.collection('clientes').findOne({ _id: new mongoose.Types.ObjectId(clientId) });
    return client;
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
            io.to(salaId).emit('receiveMsg', JSON.stringify(data));
            // Guardar el mensaje en la sesión correspondiente
            if (!memoryStorage.has(salaId)) {
                memoryStorage.set(salaId, { datosCliente, datosAdmin, messages: [mensaje] });

                // Unir al cliente al chat
                socket.join(salaId);
                // Realizar peticion al backend para actualizar el cliente admin y crear el chat en la base de datos
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
                                    {
                                        contenido: 'Bienvenido al soporte técnico, ¿necesitas ayuda?. Aquí podrás resolver tus dudas.',
                                        timestamp: Date.now(),
                                        transmitterId: datosAdmin.idAdmin.toString()
                                    }
                                ],
                                fechaInicioChat: Date.now()
                            }
                        }
                    },
                    { returnDocument: "after" }
                );

                io.emit('adminJoinRoom', JSON.stringify({ keyChat: salaId, datosCliente, datosAdmin, firstMsg: mensaje }));
            }
        });

        // El administrador se une a la sala del cliente
        socket.on('adminJoinRoom', (data) => {
            const { keyChat, datosAdmin } = JSON.parse(data);

            if (memoryStorage.has(keyChat)) {
                console.log('Admin uniendose a la sala');
                socket.join(keyChat);
            }

            // const session = memoryStorage.get(keyChat);
            // if (session && session.messages.length > 0 && session.messages.length <= 1) {
            //     //console.log('Enviando historial de mensajes al administrador para la sala: ', keyChat);
            //     socket.emit('historyChat', JSON.stringify(session.messages));
            // }
        })
    })
}