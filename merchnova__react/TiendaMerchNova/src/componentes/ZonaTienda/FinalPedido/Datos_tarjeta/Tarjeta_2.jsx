import { useEffect, useState } from "react";
import requestFetch from "../../../Servicios/peticiones_fetch";
import { CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "../../../configurations/config";
import FormTarjeta from "./FormTarjeta";

function Tarjeta({ setDatosTarjeta, setPaymentMethod, paymentMethod, clientData, direccionEnvio }) {

    const [clientSecret, setClientSecret] = useState();

    useEffect(
        () => {
            const chargeClientSecret = async () => {
                if (paymentMethod !== 'tarjeta') return;

                const responseStripe = await requestFetch.getClientStripe(clientData, paymentMethod, direccionEnvio);
                console.log('Respuesta client secret: ', responseStripe);
                setClientSecret(responseStripe.clientSecret);
            }

            chargeClientSecret();
        }, [paymentMethod]
    );

    const options = {
        clientSecret
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

            {
                clientSecret ?
                    <Elements stripe={stripePromise} options={options}>
                        <FormTarjeta paymentMethod={paymentMethod} />
                    </Elements>
                    :
                    <div className="container">
                        <div className="d-flex justify-content-center align-items-center flex-column">
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                            <span>Cargando</span>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Tarjeta;
