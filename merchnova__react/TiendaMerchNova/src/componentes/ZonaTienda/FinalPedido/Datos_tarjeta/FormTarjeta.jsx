import { useElements, useStripe } from "@stripe/react-stripe-js";

function FormTarjeta({ paymentMethod }) {

    const stripe = useStripe();
    const elements = useElements();

    async function handleSubmit() {

        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173/Portal/Pedido/CompraExitosa'
            }
        });


        if (error) {
            console.log('Error al realizar el pago con stripe: ', error);
        }

    }

    return (
        <div className='p-2 h-100'>

            {paymentMethod === "tarjeta" && (
                <div className="card-form">
                    <PaymentElement />
                    <button disabled={!stripe} className="btn btn-primary" onClick={handleSubmit}>Comprar</button>
                </div>
            )}
        </div>
    )
}

export default FormTarjeta;
