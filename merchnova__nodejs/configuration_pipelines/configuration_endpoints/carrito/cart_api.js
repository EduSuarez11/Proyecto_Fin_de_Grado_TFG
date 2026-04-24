const express = require('express');
const mongoose = require('mongoose');

const manage_cart = express.Router();

async function findProduct(client, order) {
    const productExists = await mongoose.connection.collection('clientes').findOne({
        'cuenta.email': client.cuenta.email,
        'carrito.itemsPedido': {
            $elemMatch: {
                'producto.nombre': order.nombre
            }
        }
    });

    return productExists;
}

manage_cart.post('/Persistencia/Agregar', async (req, res, next) => {
    try {
        const { client, order, quantity, gastosEnvio } = req.body;
        //console.log(order, '--------', gastosEnvio);
        //console.log(req.body);
        const find = await findProduct(client, order);

        let subtotalPrice = client.carrito.itemsPedido.reduce((total, item) => {
            const precio = item.producto.precio || 0;
            const cantidad = item.quantity || 0;
            return total + (precio * cantidad);
        }, 0);

        const nuevoItemPrecio = (order.precio * quantity);
        subtotalPrice += nuevoItemPrecio;
        subtotalPrice = Math.round(subtotalPrice * 100) / 100;

        //console.log('Subtotal: ', subtotalPrice);

        let updateData;
        if (find) {
            updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
                { 'cuenta.email': client.cuenta.email, 'carrito.itemsPedido.producto.nombre': order.nombre },
                {
                    $inc: { 'carrito.itemsPedido.$.quantity': quantity },
                    $set: {
                        'carrito.gastosEnvio': gastosEnvio,
                        'carrito.subtotal': subtotalPrice,
                        'carrito.total': subtotalPrice + gastosEnvio
                    }
                },
                { returnDocument: "after" }
            );
            console.log('Cantidad actualizada: ', updateData);
        } else {
            updateData = await mongoose.connection.collection('clientes').findOneAndUpdate(
                { 'cuenta.email': client.cuenta.email, },
                {
                    $push: {
                        'carrito.itemsPedido': {
                            producto: order,
                            quantity
                        }
                    },
                    $set: {
                        'carrito.cuponDescuento': [],
                        'carrito.gastosEnvio': gastosEnvio,
                        'carrito.subtotal': subtotalPrice,
                        'carrito.total': subtotalPrice + gastosEnvio
                    }
                },
                { returnDocument: "after" }
            );
            //console.log('Nuevo producto en carrito: ', updateData);
        }

        //if (!updateData) throw new Error('No se pudo actualizar los datos del carrito');

        res.status(200).send({ code: 0, message: 'Pedido introducido en la BBDD', data: updateData });
    } catch (error) {
        console.log('Error en persistencia: ', error)
        res.status(200).send({ code: 5, message: error });
    }
});


manage_cart.post('/Persistencia/Eliminar', async (req, res, next) => {
    try {
        const { client, order, quantity } = req.body;

        const find = findProduct(client, order);

        let deleteProductCart;
        if (find) {
            deleteProductCart = await mongoose.connection.collection('clientes').findOneAndUpdate(
                { 'cuenta.email': client.cuenta.email },
                {
                    $pull: {
                        'carrito.itemsPedido': {
                            'producto.nombre': order.nombre,
                            quantity
                        }
                    }
                },
                { returnDocument: "after" }
            );
        }

        res.status(200).send({ code: 0, message: 'Producto eliminado del carrito', data: deleteProductCart })
    } catch (error) {
        console.log('Error en persistencia: ', error)
        res.status(200).send({ code: 6, message: error });
    }
});

manage_cart.post('/Persistencia/Actualizar', async (req, res, next) => {
    try {
        const { client, order, quantity } = req.body;

        const find = findProduct(client, order);

        let updateProductCart;
        if (find) {
            updateProductCart = await mongoose.connection.collection('clientes').findOneAndUpdate(
                { 'cuenta.email': client.cuenta.email, 'carrito.itemsPedido.producto.nombre': order.nombre },
                { $set: { 'carrito.itemsPedido.$.quantity': quantity } },
                { returnDocument: "after" }
            )
        }

        res.status(200).send({ code: 0, message: 'Producto actualizado en el carrito', data: updateProductCart });
    } catch (error) {
        console.log('Error en persistencia: ', error)
        res.status(200).send({ code: 7, message: error });
    }
});

module.exports = manage_cart;
