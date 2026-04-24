const express = require('express');
const mongoose = require('mongoose');

const manage_category = express.Router();


manage_category.get('/Categorias', async (req, res, next) => {
    try {
        const allCategories = await mongoose.connection.collection('categorias').find().toArray();

        if (!allCategories) throw new Error('No se pudieron encontrar las categorias');

        res.status(200).send({ code: 0, message: 'Categorias obtenidas', categories: allCategories });
    } catch (error) {
        res.status(200).send({ code: 8, message: error, categories: [] });
    }
});

module.exports = manage_category;