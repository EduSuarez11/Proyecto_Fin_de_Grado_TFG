const express = require('express');
const mongoose = require('mongoose');
const mailjetService = require('../../servicios/mailjetService');

const manage_profile_data = express.Router();


manage_profile_data.post('/ForgotPassword', async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log('Email recibido para recuperar contraseña: ', email);
        const existClient = await mongoose.connection.collection('clientes').findOne({ 'cuenta.email': email });

        if (existClient === null) throw new Error('Ese correo no se encuentra registrado.');

        mailjetService.sendEmailForSetPassword(existClient, email);

        res.status(200).send({ code: 0, message: 'Recibirás un email para restablecer tu contraseña.' })
    } catch (error) {
        res.status(200).send({ code: 12, message: error.message })
    }
});


manage_profile_data.post('/ResetPassword', async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;
        console.log('Datos del req.body: ', req.body);
        //        const existClient = await mongoose.connection.collection('clientes').findOne({ _id: new mongoose.Types.ObjectId(clientId) });

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

module.exports = manage_profile_data;
