import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

function methodAddToCart(item, pos, newItem) {
    //console.log('Item: ', item, '; pos: ', pos, '; newItem: ', newItem)
    if (pos >= 0) {
        item[pos].quantity += newItem.quantity;
    } else {
        item.push(newItem);
    }
}

function updateToCart(item, pos, newItem) {
    if (pos >= 0) {
        item[pos].quantity = newItem.quantity;
    }
}


const useGlobalState = create(
    persist(
        (set, get, store) => {
            return {
                clientData: null,

                order: {
                    items: [],
                    estado: '',
                    fechaPago: null,
                    metodoPago: {},
                    metodoEnvio: {},
                    direccionEnvio: {},
                    subtotal: 0,
                    gastosEnvio: 1.03,
                    total: 0
                },

                setClientData: (newData) => {
                    set(oldData => {
                        return {
                            ...oldData,
                            clientData: {
                                ...oldData.clientData,
                                ...newData
                            }
                        }
                    })
                },

                logOut: () => {
                    set({ clientData: null })
                },

                setOrder: (action, newItem) => {
                    set(oldData => {
                        //console.log('Propiedades del newItem: ', newItem);
                        // Casos para manejar el carrito
                        let item = [...oldData.order.items]
                        let index = item.findIndex(i => i.product?._id === newItem.product?._id);

                        //console.log('Item: ', item)
                        // #region --------------------------- Item ----------------------------
                        /**
                         * Objeto item:
                            [
                                {
                                    product: {id: '...', nombre: '...'}
                                    quantity: 0
                                }
                            ]
                        */
                        //#endregion ------------------------------------------------------------ 
                        action === 'addToCart' ?
                            methodAddToCart(item, index, newItem)
                            :
                            (
                                action === 'deleteToCart' ?
                                    item = item.filter(i => i.product._id !== newItem.product._id)
                                    :
                                    updateToCart(item, index, newItem)
                            );

                        //item.forEach((i) => subtotalPrice += (i.product.precio * i.quantity))
                        const subtotalPrice = item.reduce((total, i) => total + (i.product.precio * i.quantity), 0);


                        return {
                            ...oldData,
                            order: ({
                                ...oldData.order,
                                items: item,
                                subtotal: Math.round(subtotalPrice * 100) / 100
                            })
                        }
                    })
                },

                setPayData: (action, newItem) => {
                    set(oldData => {
                        //console.log('Item: ', newItem);
                        if (action === 'setShippingData') {
                            return {
                                ...oldData,
                                order: {
                                    ...oldData.order,
                                    direccionEnvio: newItem
                                }
                            };
                        }

                        if (action === 'setDataCard') {
                            return {
                                ...oldData,
                                order: {
                                    ...oldData.order,
                                    metodoPago: newItem
                                }
                            };
                        }
                        // Retornar el estado sin cambios si la acción no coincide
                        return oldData;
                    })
                }
            }
        },
        {
            name: 'merchnova-storage-v1',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useGlobalState;
