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
        // Unir al cliente al chat
        socket.on('joinRoom', async (clientData) => {
            // Creación de la sala
            socket.join(`sala-${clientData._id}`);
            //console.log('Cliente se ha conectado en la sala: ', keyChat);
            if (!memoryStorage.has(`sala-${clientData._id}`)) {
                //console.log('Administradores disponibles para asignar al cliente');

                //socket.emit('assignedAdmin', JSON.stringify(adminData));
                memoryStorage.set(clientData._id, { datosCliente: clientData.chats.datosCliente, adminData: clientData.chats.datosAdmin, messages: clientData.chats.mensajes });

                // Realizar el emit al cliente para que reciba el mensaje de bienvenida
                //io.to(keyChat).emit('receiveMsg', JSON.stringify(defaultMsg));
            } else {
                const session = memoryStorage.get(clientData.chats._id);
                //console.log('Datos de la sesión encontrada para el cliente: ', session);

                const adminData = {
                    id: session.datosAdmin.idAdmin,
                    nombre: session.datosAdmin.nombreAdmin,
                    imagenCuenta: session.datosAdmin.imagenCuenta
                }

                socket.emit('assignedAdmin', JSON.stringify(adminData));
                memoryStorage.set(clientData.chats._id, { ...session, datosCliente: clientData.chats.datosCliente, datosAdmin: adminData, messages: session.messages });
            }
        });

        // Enviar mensaje con la sala ya creada
        socket.on('sendMsg', async (data) => {
            const { salaId, mensaje, datosCliente, datosAdmin } = data;

            const session = memoryStorage.get(salaId);
            //console.log('Mensajes: ', mensaje);
            console.log(`NUEVO MENSAJE de [${mensaje.transmitterId}] para la [${salaId}]: ${mensaje.contenido} mandado en ${mensaje.timestamp}`);
            io.to(salaId).emit('receiveMsg', JSON.stringify(data));
            // Guardar el mensaje en la sesión correspondiente
            if (!session) {
                memoryStorage.set(salaId, { datosCliente, datosAdmin, messages: [mensaje] });
                //messages = { contenido, transmitterId, timestamp, keyChat };
                //console.log(`Avisando al admin ${adminId} que hay un mensaje nuevo en ${keyChat}`);

                //console.log('Datos del cliente para el mensaje: ', dataClient);
                // Realizar peticion al backend para actualizar el cliente admin y crear el chat en la base de datos
                const adminUpdate = await mongoose.connection.collection('clientes').findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(datosAdmin.idAdmin) },
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

                io.emit(`notification_admin_${datosAdmin.idAdmin}`, {
                    keyChat: salaId
                    // dataClient: datosCliente,
                    // dataAdmin: datosAdmin,
                    // horaUltimoMensaje: mensaje.timestamp,
                    // ultimoMensaje: mensaje.contenido,
                    // mensajes: [...messages, mensaje]
                });


            }
        });

        // El administrador se une a la sala del cliente
        socket.on('adminJoinRoom', (keyChat) => {
            socket.join(keyChat);
            //console.log('Administrador se ha unido a la sala de soporte: ', keyChat);

            const session = memoryStorage.get(keyChat);
            if (session && session.messages.length > 0 && session.messages.length <= 1) {
                //console.log('Enviando historial de mensajes al administrador para la sala: ', keyChat);
                socket.emit('historyChat', JSON.stringify(session.messages));
            }
        })
    })
}