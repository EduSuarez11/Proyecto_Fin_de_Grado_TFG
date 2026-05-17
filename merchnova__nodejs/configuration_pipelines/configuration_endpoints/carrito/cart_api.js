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
        const { client, order, quantity, gastosEnvio, talla } = req.body;
        //console.log(order, '--------', gastosEnvio);

        const find = await findProduct(client, order);

        let subtotalPrice = client.carrito.itemsPedido.reduce((total, item) => {
            const precio = item.producto.precio || 0;
            const cantidad = item.quantity || 0;
            return total + (precio * cantidad);
        }, 0);


        const nuevoItemPrecio = (order.precio * quantity);
        subtotalPrice += nuevoItemPrecio;
        subtotalPrice = Math.round(subtotalPrice * 100) / 100;

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
                    },
                    $push: {
                        'carrito.itemsPedido.$.producto.talla': talla
                    }
                },
                { returnDocument: "after" }
            );
            //console.log('Cantidad actualizada: ', updateData);
        } else {
            order.talla = talla ? [talla] : [];
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

        // Calcular el subtotal 
        const subtotal = client.carrito.itemsPedido.reduce((sum, item) => {
            if (item.producto.nombre === order.nombre) {
                return sum;
            }
            return sum + (item.producto.precio * item.quantity);
        }, 0);

        const subtotalRound = Math.round(subtotal * 100) / 100;

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
                    },
                    $set: {
                        'carrito.subtotal': subtotalRound,
                        'carrito.total': subtotalRound + client.carrito.gastosEnvio
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

        // Si actualiza mediante el carrito, se añadira la última talla que haya elegido (en un mismo producto)
        const lastSize = order.talla.slice(-1)[0];

        // Calcular el subtotal
        const subtotal = client.carrito.itemsPedido.reduce((sum, item) => {
            const cantidadActual = item.producto.nombre === order.nombre ? quantity : item.quantity;
            return sum + (item.producto.precio * cantidadActual);
        }, 0);

        const subtotalRound = Math.round(subtotal * 100) / 100;

        let updateProductCart;
        if (find) {
            updateProductCart = await mongoose.connection.collection('clientes').findOneAndUpdate(
                { 'cuenta.email': client.cuenta.email, 'carrito.itemsPedido.producto.nombre': order.nombre },
                {
                    $set: {
                        'carrito.itemsPedido.$.quantity': quantity,
                        'carrito.gastosEnvio': client.carrito.gastosEnvio,
                        'carrito.subtotal': subtotalRound,
                        'carrito.total': subtotalRound + client.carrito.gastosEnvio
                    },
                    $push: { 'carrito.itemsPedido.$.producto.talla': lastSize }
                },
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
