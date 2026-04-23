import { useEffect, useImperativeHandle, useRef, useState } from "react";
import requestFetch from "../../../Servicios/peticiones_fetch";
import { CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "../../../configurations/config";
import FormTarjeta from "./FormTarjeta";

function Tarjeta({ setDatosTarjeta, setPaymentMethod, paymentMethod, clientData, direccionEnvio, ref }) {

    const stripe = useStripe();
    const elements = useElements();
    //const [clientSecret, setClientSecret] = useState();
    //const [processing, setProcessing] = useState(false);

    // useEffect(
    //     () => {
    //         const chargeClientSecret = async () => {
    //             if (paymentMethod !== 'tarjeta') return;
    //             const responseStripe = await requestFetch.getClientStripe(clientData, paymentMethod, direccionEnvio);
    //             console.log('Respuesta client secret: ', responseStripe);
    //             setClientSecret(responseStripe.clientSecret);
    //             console.log('Cliente secreto: ', responseStripe.clientSecret);
    //         }

    //         chargeClientSecret();
    //     }, [paymentMethod]
    // );


    useImperativeHandle(ref, () => { return { stripe, elements, handle: handleSubmit } });

    async function handleSubmit() {
        if (!stripe || !elements) return;

        //setProcessing(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173/Portal/Pedido/CompraExitosa'
            }
        });

        if (error) console.log('Error al realizar el pago con stripe: ', error);
        //setProcessing(false);
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
                                    setDatosTarjeta(prev => tipo === 'Tarjeta' ? ({ ...prev, tipo: tipo.toLowerCase() }) : ({ tipo: tipo.toLowerCase() }));
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
