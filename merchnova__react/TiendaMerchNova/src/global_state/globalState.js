import { create } from 'zustand';

const useGlobalState = create(
    (get, set, store) => {
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
                console.log('Funcion setOrder en ejecucion')
                set(oldData => {
                    console.log('Propiedades del newItem: ', newItem);
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

                        case 'delete':
                            item = item.filter(i => i.product._id !== newItem.product._id);
                            break;

                        case 'emptyCart':
                            item = []
                            break;
                        default:
                            break;
                    }
                    console.log('Producto que se va a añadir: ', item);
                    return {
                        ...oldData,
                        order: ({
                            ...oldData.order,
                            items: item
                        })
                    }
                })
            }
        }
    }

)

export default useGlobalState;
