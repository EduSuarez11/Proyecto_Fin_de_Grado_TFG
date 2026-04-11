import { useState } from "react";
import Resumen from "./Resumen/Resumen_3";
import useGlobalState from "../../../global_state/globalState";
import { Link, useNavigate } from "react-router";
import Direcciones from "./Datos_direcciones/Direcciones_1";
import Tarjeta from "./Datos_tarjeta/Tarjeta_2";

function FinPedido() {

    const [stages, setStages] = useState(1);
    const navigate = useNavigate();
    const { clientData, order, setPayData } = useGlobalState();
    const [direccionEnvio, setDireccionEnvio] = useState();
    const [datosTarjeta, setDatosTarjeta] = useState();
    const [paymentMethod, setPaymentMethod] = useState({ tipo: '' });

    const subtotal = clientData === null ? null : clientData.carrito.map(item => item.producto.precio * item.quantity).reduce((acc, curr) => acc + curr, 0);

    function onChangeAddress(ev) {
        setDireccionEnvio({
            ...direccionEnvio,
            [ev.target.id]: ev.target.value
        });
    }



    function onChangeDataCard(ev) {
        setDatosTarjeta({
            ...datosTarjeta,
            [ev.target.id]: ev.target.value
        });
    }

    function nextStage(stage) {
        setStages(stages + 1);

        if (stage === 1) {
            console.log('Datos direccion (pasa por aqui): ', direccionEnvio);
            setPayData('setShippingData', direccionEnvio);
        }
        if (stage === 2) {
            console.log('Datos tarjeta (pasa por aqui): ', datosTarjeta);
            setPayData('setDataCard', datosTarjeta);
        }
    }

    async function handleSubmitPurchaseInfo() {
        console.log(`Datos de envio: Direccion - ${JSON.stringify(direccionEnvio)} | Tarjeta - ${JSON.stringify(datosTarjeta)}`);

        console.log('Datos en global state: ', order);

        const requestPay = await fetch('http://localhost:3000/api/Tienda/RealizarCompra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clientData, order })
        });

        const response = await requestPay.json();
        console.log('Respuesta de stripe: ', response)

        if (response.code !== 0) throw new Error('Fallo al realizar el pago.');

        navigate('/', { state: { msg: 'Has realizado tu compra con éxito' } });
    }

    return (
        <div className="checkout-container">
            <div className="checkout-grid">
                <div className="checkout-left">
                    {/* Aqui van los 3 pasos para realizar el pago */}

                    {
                        stages === 1 ? <Direcciones onChangeAddress={onChangeAddress} />
                            :
                            stages === 2 ?
                                <Tarjeta onChangeDataCard={onChangeDataCard} setDatosTarjeta={setDatosTarjeta} setPaymentMethod={setPaymentMethod} paymentMethod={paymentMethod} />
                                :
                                <Resumen datosTarjeta={datosTarjeta} datosDireccion={direccionEnvio} paymentMethod={paymentMethod} />
                    }

                    <div className="checkout-actions">
                        {
                            stages === 1 ?
                                <div className='d-flex flex-row justify-content-end px-2'>
                                    <Link to='/Cart'>
                                        <button className="btn btn-outline-secondary me-2 px-4">Volver al carrito</button>
                                    </Link>
                                    <button className="btn btn-stage" onClick={() =>  nextStage(stages) }>Continuar</button>
                                </div>
                                : stages !== 3 ?
                                    <div className='d-flex flex-row justify-content-end px-2'>
                                        <button className="btn btn-outline-secondary me-2 px-4" onClick={() => setStages(stages - 1)}>Volver</button>
                                        <button className="btn btn-stage" onClick={() => nextStage(stages)}>Continuar</button>
                                    </div>
                                    :
                                    <div className="d-flex flex-row justify-content-end px-2 mt-4">
                                        <button className="btn btn-outline-secondary me-2 px-4" onClick={() => setStages(stages - 1)}>Volver</button>
                                    </div>
                        }
                    </div>


                </div>

                <div className="checkout-right">
                    <h3>Resumen del pedido</h3>

                    {
                        clientData.carrito.map((item, pos) =>
                            <div className="product" key={pos}>
                                <span>{item.producto.nombre}</span>
                                <span>+ {item.producto.precio}</span>
                            </div>
                        )
                    }

                    <div className="product text-danger">
                        <span>Gastos de envío</span>
                        <span>{order.gastosEnvio}</span>
                    </div>

                    {/* <div className="product">
                        <span>Taza merch</span>
                        <span>9.99€</span>
                    </div> */}

                    <hr />

                    <div className="total">
                        <span>Total</span>
                        <span>{Math.round((subtotal + order.gastosEnvio) * 100) / 100}</span>
                    </div>

                    {
                        stages === 3 &&
                        <button className="pay-btn" onClick={handleSubmitPurchaseInfo}>Finalizar compra</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default FinPedido;
