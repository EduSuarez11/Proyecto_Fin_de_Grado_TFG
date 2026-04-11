import './Resumen_3.css';
import { useState } from "react";
import useGlobalState from "../../../../global_state/globalState";

function Resumen({ datosTarjeta, datosDireccion, paymentMethod }) {

    const { clientData, order } = useGlobalState();
    const subtotal = clientData === null ? null : clientData.carrito.map(item => item.producto.precio * item.quantity).reduce((acc, curr) => acc + curr, 0);

    return (
        <div className="checkout-step fade-in">
            <h3 className="step-title">Resumen del pedido</h3>

            <div className="summary-section">
                <h5>Dirección de envío</h5>
                <p>{datosDireccion?.nombreCompleto}</p>
                <p>{datosDireccion?.calle}</p>
                <p>{datosDireccion?.municipio}, {datosDireccion?.provincia} - {datosDireccion?.codigoPostal}</p>
                <p>{datosDireccion?.pais}</p>
            </div>

            <div className="summary-section">
                <h5>Método de pago</h5>
                <p>
                    {paymentMethod === "tarjeta" && "💳 Tarjeta"}
                    {paymentMethod === "paypal" && "🟡 PayPal"}
                </p>

                {paymentMethod === "tarjeta" && (
                    <p className="card-preview">
                        **** **** **** {datosTarjeta?.cardNumber.slice(-4)}
                    </p>
                )}
            </div>

            <div className="summary-section">
                <h5>Productos</h5>

                {clientData.carrito.map((item, index) => (
                    <div className="summary-product" key={index}>
                        <img src={`http://localhost:3000${item.producto.imagen}`} alt="" />
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
