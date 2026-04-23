import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useImperativeHandle, useState } from "react";

function FormTarjeta({ paymentMethod, ref }) {

    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    useImperativeHandle(ref, () => {
        return {
            handle: handleSubmit,
            stripe,
            elements
        }
    });


    async function handleSubmit() {

        if (!stripe || !elements) return;

        setProcessing(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173/Portal/Pedido/CompraExitosa'
            }
        });


        if (error) console.log('Error al realizar el pago con stripe: ', error);

        setProcessing(false);

    }

    return (
        <div className='p-2 h-100'>
            {paymentMethod === "tarjeta" && (
                <div className="card-form">
                    <PaymentElement />
                    {/* <button disabled={!stripe || !elements} className="btn btn-primary" onClick={handleSubmit}>Comprar</button> */}
                </div>
            )}
        </div>
    )
}

export default FormTarjeta;
