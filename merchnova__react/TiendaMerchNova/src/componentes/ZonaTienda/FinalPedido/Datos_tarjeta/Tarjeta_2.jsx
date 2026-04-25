import { useEffect, useImperativeHandle, useRef, useState } from "react";
import requestFetch from "../../../Servicios/request_external_api";
import { CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "../../../configurations/config";
import FormTarjeta from "./FormTarjeta";

function Tarjeta({ setPaymentMethod, paymentMethod, clientData, direccionEnvio, ref }) {

    const stripe = useStripe();
    const elements = useElements();

    useImperativeHandle(ref, () => { return { stripe, elements, handle: handleSubmit } });

    async function handleSubmit() {
        if (!stripe || !elements) return;
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `http://localhost:5173/Portal/Pedido/CompraExitosa?orderId=${clientData.carrito._id}&clientId=${clientData._id}`
            }
        });
        
        if (error) console.log('Error al realizar el pago con stripe: ', error);
    }



    return (
        <div className="px-2 py-3 mb-4">
            <h3 className="step-title">Método de pago</h3>

            <div className="payment-options">
                {
                    ['Tarjeta', 'PayPal'].map((tipo, index) =>
                        <div className={`payment-card ${paymentMethod === tipo.toLowerCase() ? "active" : ""}`} key={index}>
                            <input type="radio" id={tipo.toLowerCase()} name="paymentMethod" value={tipo.toLowerCase()} checked={paymentMethod === tipo.toLowerCase()}
                                onChange={() => {
                                    setPaymentMethod(tipo.toLowerCase());
                                }}
                            />
                            <label htmlFor={tipo.toLowerCase()}>{tipo}</label>
                        </div>
                    )
                }
            </div>


            {/* <Elements stripe={stripePromise} options={options} key={clientSecret}> */}
            <div className='px-2'>
                {
                    paymentMethod === "tarjeta" &&
                    (
                        <div className="card-form mt-5">
                            <PaymentElement />
                            {/* <button disabled={!stripe || !elements} className="btn btn-primary" onClick={handleSubmit}>Comprar</button> */}
                        </div>
                    )
                }
            </div>
            {/* //</Elements> */}

        </div>
    )
}

export default Tarjeta;
