import './Resumen_3.css';
import { useImperativeHandle, useState } from "react";
import useGlobalState from "../../../../global_state/globalState";
import { useElements, useStripe } from '@stripe/react-stripe-js';

function Resumen({ datosDireccion, paymentMethod }) {

    const { clientData, order } = useGlobalState();
    
    const subtotal = clientData === null ? null : clientData.carrito.itemsPedido.map(item => item.producto.precio * item.quantity).reduce((acc, curr) => acc + curr, 0);

    // async function handleSubmit() {
    //     if (!stripe || !elements) return;

    //     //setProcessing(true);
    //     const { error } = await stripe.confirmPayment({
    //         elements,
    //         confirmParams: {
    //             return_url: 'http://localhost:5173/Portal/Pedido/CompraExitosa'
    //         }
    //     });

    //     if (error) console.log('Error al realizar el pago con stripe: ', error);
    //     //setProcessing(false);
    // }

    // useImperativeHandle(ref, () => {
    //     return {
    //         stripe,
    //         elements,
    //         handle: handleSubmit
    //     }
    // })


    return (
        <div className="checkout-step fade-in">
            <h3 className="step-title">Resumen del pedido</h3>

            <div className="summary-section">
                <h5>Dirección de envío</h5>
                <p>{datosDireccion?.nombreCompleto}</p>
                <p>{datosDireccion?.domicilio}</p>
                <p>{datosDireccion?.municipio}, {datosDireccion?.provincia} - {datosDireccion?.codigoPostal}</p>
                <p>{datosDireccion?.pais}</p>
            </div>

            <div className="summary-section">
                <h5>Método de pago</h5>
                <p>
                    {paymentMethod === "tarjeta" && (<i class="fa-solid fa-credit-card"></i> + " Tarjeta")}
                    {paymentMethod === "paypal" && (<i class="fa-brands fa-paypal"></i>  + " PayPal")}
                </p>

                {/* {paymentMethod === "tarjeta" && (
                    <p className="card-preview">
                        **** **** **** {datosTarjeta?.cardNumber.slice(-4)}
                    </p>
                )} */}
            </div>

            <div className="summary-section">
                <h5>Productos</h5>

                {clientData.carrito.itemsPedido.map((item, index) => (
                    <div className="summary-product" key={index}>
                        <img src={item.producto.imagen} alt="" />
                        <div>
                            <p>{item.producto.nombre}</p>
                            <span>Cantidad: {item.quantity}</span>
                        </div>
                        <strong>{(item.producto.precio * item.quantity)}€</strong>
                    </div>
                ))}
            </div>

            <div className="summary-total">
                <h4>Total</h4>
                <h4>{Math.round((subtotal + order.gastosEnvio) * 100) / 100}</h4>
            </div>
        </div>
    )
}

export default Resumen;
