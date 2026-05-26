const express = require('express');
const mongoose = require('mongoose');
const mailjetService = require('../../servicios/mailjetService');
const jwtService = require('../../servicios/jwtService');
const bcrypt = require('bcrypt');

const manage_profile_data = express.Router();


manage_profile_data.post('/Perfil-Update', async (req, res, next) => {
    try {
        const { data, clientData } = req.body;

        if (!clientData || !data) throw new Error('Requiere al menos un dato para actualizar el perfil.');

        console.log('Datos a actualizar:', data);

        // Actualizar los datos del cliente
        const updateClient = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(clientData._id) },
            {
                $set: {
                    nombreCompleto: data?.nombreCompleto ? data?.nombreCompleto : clientData.nombreCompleto,
                    cuenta: {
                        email: clientData.cuenta.email,
                        password: clientData.cuenta.password,
                        genero: data?.genero ? data?.genero : clientData?.cuenta?.genero || '',
                        cuentaActiva: clientData.cuenta.cuentaActiva,
                        imagenCuenta: data?.imagenCuenta  ? data?.imagenCuenta : clientData?.cuenta?.imagenCuenta || '',
                        creacionCuenta: clientData.cuenta.creacionCuenta,
                        telefono: data?.telefono  ? data?.telefono : clientData?.cuenta?.telefono || '',
                        sobreMi: data?.sobreMi  ? data?.sobreMi : clientData?.cuenta?.sobreMi || '',
                        tipo: clientData.cuenta.tipo,
                        rol: clientData.cuenta.rol,
                        visibilidad: clientData.cuenta.visibilidad,
                        notificaciones: clientData.cuenta.notificaciones
                    },
                    // En este caso, en el perfil se mostrará y editará la primera dirección
                    'direcciones.0.codigoPostal': data?.codigoPostal  ? data?.codigoPostal : clientData?.direcciones[0]?.codigoPostal || '',
                    'direcciones.0.domicilio': data?.domicilio  ? data?.domicilio : clientData?.direcciones[0]?.domicilio || '',
                    'direcciones.0.municipio': data?.municipio  ? data?.municipio : clientData?.direcciones[0]?.municipio || '',
                    'direcciones.0.pais': data?.pais  ? data?.pais : clientData?.direcciones[0]?.pais || '',
                    'direcciones.0.provincia': data?.provincia  ? data?.provincia : clientData?.direcciones[0]?.provincia || ''
                }
            },
            { returnDocument: "after" }
        );

        if (!updateClient) throw new Error('No se pudo actualizar el cliente.');

        // Actualizar tambien la info del chat
        if (updateClient.cuenta.rol !== 'ADMINISTRADOR') {
            const datosClienteActualizados = {
                idCliente: new mongoose.Types.ObjectId(clientData._id),
                nombreCliente: data.nombreCompleto || updateClient.nombreCompleto,
                imagenCuenta: data.cuenta?.imagenCuenta || updateClient.cuenta?.imagenCuenta
            };

            // 4. Actualizar los chats de los admins donde aparezca este cliente
            await mongoose.connection.collection('clientes').updateMany(
                { 'chats.datosCliente.idCliente': new mongoose.Types.ObjectId(clientData._id) },
                { $set: { 'chats.$[chat].datosCliente': datosClienteActualizados } },
                { arrayFilters: [{ 'chat.datosCliente.idCliente': new mongoose.Types.ObjectId(clientData._id) }] }
            );
        } else {
            //console.log('Cliente admin: ', updateClient);
            //console.log('Data: ', data);
            const datosAdminActualizados = {
                idAdmin: new mongoose.Types.ObjectId(clientData._id),
                nombreAdmin: data.nombreCompleto || updateClient.nombreCompleto,
                imagenCuenta: data.cuenta?.imagenCuenta || updateClient.cuenta?.imagenCuenta
            };
            await mongoose.connection.collection('clientes').updateMany(
                { 'chats.datosAdmin.idAdmin': new mongoose.Types.ObjectId(clientData._id) },
                { $set: { 'chats.$[chat].datosAdmin': datosAdminActualizados } },
                { arrayFilters: [{ 'chat.datosAdmin.idAdmin': new mongoose.Types.ObjectId(clientData._id) }] }
            );
        }
        const userUpdate = await mongoose.connection.collection('clientes').findOne({ _id: new mongoose.Types.ObjectId(clientData._id) })

        console.log('Perfil y chats actualizados exitosamente');
        res.status(200).send({ code: 0, message: 'Los datos han sido actualizados con éxito.', data: { newClientData: userUpdate } });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).send({ code: 4, message: `Error al actualizar perfil: ${error.message}` });
    }
});


manage_profile_data.post('/ForgotPassword', async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log('Email recibido para recuperar contraseña: ', email);
        const existClient = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': email });

        if (existClient === null) throw new Error('Ese correo no se encuentra registrado.');

        const recuperationToken = mailjetService.sendEmailForSetPassword(existClient, email);

        res.status(200).send({ code: 0, message: 'Recibirás un email para restablecer tu contraseña.', token: recuperationToken });
    } catch (error) {
        res.status(200).send({ code: 12, message: error.message })
    }
});


manage_profile_data.post('/ResetPassword', async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;
        console.log('Datos del req.body: ', req.body);

        if (confirmPassword !== password) throw new Error('Las contraseñas deben coincidir');
        if (confirmPassword.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
        if (confirmPassword.length > 25) throw new Error('La contraseña no puede tener más de 25 caracteres.');

        const updatePassword = await mongoose.connection.collection('clientes').updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.clientId) },
            { $set: { 'cuenta.password': bcrypt.hashSync(password, 10) } }
        )
        if (updatePassword.modifiedCount === 0) throw new Error('No se pudo actualizar la contraseña.');
        console.log('Contraseña cambiada: ', updatePassword);
        res.status(200).send({ code: 0, message: 'Contraseña actualizada con éxito.' })
    } catch (error) {
        res.status(200).send({ code: 13, message: error.message })
    }
});

manage_profile_data.post('/NewDirection', async (req, res, next) => {
    try {
        const { clientData, data } = req.body;
        // console.log('Direccion nueva a agregar: ', data);
        // console.log('Cliente a actualizar: ', clientData);

        const updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { 'cuenta.email': clientData.cuenta.email },
            { $push: { direcciones: data } },
            { returnDocument: "after" }
        );

        if (updateData.modifiedCount === 0) throw new Error('No se pudo añadir la nueva dirección.');

        res.status(200).send({ code: 0, message: 'Nueva dirección añadida con éxito', dataUpdate: updateData });
    } catch (error) {
        res.status(200).send({ code: 11, message: `${error.message}` });
    }
});

manage_profile_data.post('/Remove-Direction', async (req, res, next) => {
    try {
        const { clientData, direccion } = req.body;
        console.log(req.body)
        const updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { 'cuenta.email': clientData.cuenta.email, _id: new mongoose.Types.ObjectId(clientData._id) },
            {
                $pull: {
                    direcciones: {
                        domicilio: direccion.domicilio,
                        provincia: direccion.provincia,
                        municipio: direccion.municipio,
                        codigoPostal: direccion.codigoPostal,
                        pais: direccion.pais
                    }
                }
            },
            { returnDocument: "after" }
        );
        if (updateData.modifiedCount === 0) throw new Error('No se pudo eliminar la dirección.');
        res.status(200).send({ code: 0, message: 'Dirección eliminada con éxito', dataUpdate: updateData });
    } catch (error) {
        console.log('Error al eliminar dirección: ', error);
        res.status(200).send({ code: 14, message: `${error.message}` });
    }


})

manage_profile_data.post('/ChangeVisibility', async (req, res, next) => {
    try {
        const { clientData, privacity } = req.body;
        console.log(req.body);
        const updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
            { 'cuenta.email': clientData.cuenta.email, _id: new mongoose.Types.ObjectId(clientData._id) },
            {
                $set: {
                    'cuenta.visibilidad': privacity.visibility ? 'publico' : 'privado',
                    'cuenta.notificaciones': privacity.notification
                }
            },
            { returnDocument: "after" }
        );
        if (updateData.modifiedCount === 0) throw new Error('No se pudo actualizar la visibilidad.');
        res.status(200).send({ code: 0, message: 'Visibilidad cambiada', dataUpdate: updateData });
    } catch (error) {
        console.log('Error al cambiar la privacidad: ', error);
        res.status(200).send({ code: 15, message: `${error.message}` });
    }
});


manage_profile_data.post('/DeleteAccount', async (req, res, next) => {
    try {
        const { clientData } = req.body;
        const completeOperation = await mongoose.connection.collection('clientes').deleteOne(
            { 'cuenta.email': clientData.cuenta.email, _id: new mongoose.Types.ObjectId(clientData._id) }
        );

        if (completeOperation.deletedCount === 0) throw new Error('No se pudo eliminar la cuenta.');

        res.status(200).send({ code: 0, message: 'Su cuenta ha sido eliminada con éxito.' });
    } catch (error) {
        console.log('Error al eliminar la cuenta: ', error);
        res.status(200).send({ code: 16, message: `${error.message}` });
    }
});


module.exports = manage_profile_data;
