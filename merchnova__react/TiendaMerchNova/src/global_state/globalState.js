import { create } from 'zustand';

const useGlobalState = create(
    (set, get, store) => {
        return {
            clientData: null,
            order: {
                items: [],
                estado: '',
                fechaPago: null,
                metodoPago: {},
                metodoEnvio: {},
                direccionEnvio: null,
                subtotal: 0,
                gastosEnvio: 0,
                total: 0
            },

            setClientData: (newData) => {
                set(oldData => ({
                    ...oldData,
                    clientData: {
                        ...oldData.clientData,
                        ...newData
                    }
                }))
            },

            setOrder: (action, newItem) => {
                set(oldData => {
                    console.log('Propiedades del newItem: ', newItem.product);
                    let item = [...oldData.order.items]
                    let index = item.findIndex(i => i.product?._id === newItem.product?._id);

                    switch (action) {
                        case 'addToCart':
                            if (index >= 0) {
                                item[index].quantity += newItem.quantity;
                            } else {
                                item.push(newItem);
                            }
                            break;

                        case 'deleteToCart':
                            item = item.filter(i => i.product._id !== newItem.product._id);
                            //item = item.splice(index, 1);
                            break;

                        case 'emptyCart':
                            item = []
                            break;
                        default:
                            break;
                    }
                    
                    //item.forEach((i) => subtotalPrice += (i.product.precio * i.quantity))
                    const subtotalPrice = item.reduce( (total, i) => total + (i.product.precio * i.quantity), 0);

                    return {
                        ...oldData,
                        order: ({
                            ...oldData.order,
                            items: item,
                            subtotal: subtotalPrice
                        })
                    }
                })
            }
        }
    }
)

export default useGlobalState;
