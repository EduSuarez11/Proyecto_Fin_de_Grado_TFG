import { create } from 'zustand';

const useGlobalState = create(
    (get, set, store) => {
        return {
            clientData: null,
            order: {
                items: [], //<--- array de items en formato: { producto:{ ....}, cantidad: ... }
                estado: '', //<--- que puede ser: 'en formacion', 'confirmado', 'enviado', 'entregado',...
                fechaPago: null, //<---- fecha en q se realizo el pago EN MILISEGUNDOS
                metodoPago: {}, //<--- objeto asi: { tipo: 'Tarjeta credito| paypal  | ...', detalles: { numeroTarjeta: '**** **** **** 1234', titular: 'Juan Perez', fechaCaducidad: '12/25' } }
                metodoEnvio: {}, //<--- objeto asi: { transportista: 'DHL | SEUR | MRW | ...', servicio: '24h | 48h | ...', coste: 5.99 }
                direccionEnvio: null, //<--- objeto con los datos de la direccion de envio
                direccionFacturacion: null, //<--- objeto con los datos de la direccion de facturacion
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
                    let item = [...oldData.order.items]
                    let index = item.findIndex(i => i.product._id === newItem.product._id);
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

                    return {
                        ...oldData,
                        order: ({
                            ...oldData.order,
                            items: item,
                            gastosEnvio,
                            subtotal,
                            total
                        })
                    }
                })
            }
        }
    }

)

export default useGlobalState;
