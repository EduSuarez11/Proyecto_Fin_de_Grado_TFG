const express = require('express');
const mongoose = require('mongoose');

const manage_chat = express.Router();

// Crear el chat para el usuario normal
manage_chat.post('/CreateChat', async (req, res, next) => {
    try {
        /*
            sala: `sala-${clientData._id}`,
            datosCliente: {idCliente, nombreCliente, imagenCuenta},
            datosAdmin: {id, nombre, imagenCuenta}
            mensajes: [], <-- { contenido: string, timestamp: number, transmitterId: string, }
            fechaInicioChat: Date
        */
        const newChat = req.body;

        const admins = await mongoose.connection.collection('clientes').find({ 'cuenta.rol': 'ADMINISTRADOR' }).toArray();
        const assignedAdmin = admins[Math.floor(Math.random() * admins.length)];

        const chatId = `sala-${new mongoose.Types.ObjectId()}`;

        const updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(newChat.datosCliente.idCliente) },
            {
                $push: {
                    chats: {
                        _id: chatId,
                        datosCliente: {
                            idCliente: new mongoose.Types.ObjectId(newChat.datosCliente.idCliente),
                            nombreCliente: newChat.datosCliente.nombreCliente,
                            imagenCuenta: newChat.datosCliente.imagenCuenta
                        },
                        datosAdmin: {
                            idAdmin: new mongoose.Types.ObjectId(assignedAdmin._id),
                            nombreAdmin: assignedAdmin.nombreCompleto,
                            imagenCuenta: assignedAdmin.cuenta.imagenCuenta
                        },
                        mensajes: [
                            // {
                            //     contenido: 'Bienvenido al soporte técnico, ¿necesitas ayuda?. Aquí podrás resolver tus dudas.',
                            //     timestamp: Date.now(),
                            //     transmitterId: assignedAdmin._id.toString()
                            // }
                        ],
                        fechaInicioChat: Date.now(),
                        estado: 'ACTIVO'
                    }
                }
            },
            { returnDocument: "after" }
        );
        if (!updateData) throw new Error('No se pudo crear el chat.');
        console.log('Chat creado');
        res.status(200).send({ code: 0, message: 'Chat creado con éxito', data: { userUpdate: updateData, salaId: chatId } });
    } catch (error) {
        console.log('Error al crear el chat: ', error);
        res.status(200).send({ code: 16, message: `${error.message}` });
    }
})


// Recuperar el chat al entrar a la conversacion
manage_chat.get('/GetChat', async (req, res, next) => {
    try {
        const { clientId } = req.query;
        const getChat = await mongoose.connection.collection('clientes').findOne({ _id: new mongoose.Types.ObjectId(clientId) });
        if (!getChat) throw new Error('No se pudo obtener el chat.');
        res.status(200).send({ code: 0, message: 'Chat obtenido', data: { chat: getChat.chats } });
    } catch (error) {
        console.log('Error al obtener el chat: ', error);
        res.status(200).send({ code: 17, message: `${error.message}` });
    }
})


manage_chat.post('/EndChat', async (req, res, next) => {
    try {
        // En el req.body ira la sala a la que se finalizaria el chat
        const { salaId } = req.body;
        console.log('Sala: ', salaId);

        const clientChatEnd = await mongoose.connection.collection('clientes').updateMany(
            { 'chats._id': salaId },
            { $set: { 'chats.$.estado': 'ARCHIVADO' } }
        );

        if (clientChatEnd.modifiedCount === 0) throw new Error('No se pudo finalizar el chat.');

        res.status(200).send({ code: 0, message: 'Chat finalizado', data: { client: clientChatEnd } });
    } catch (error) {
        console.log('Error al finalizar el chat: ', error);
        res.status(200).send({ code: 18, message: `${error.message}` });
    }
})

module.exports = manage_chat;