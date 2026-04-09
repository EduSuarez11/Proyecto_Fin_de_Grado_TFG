import { useState } from "react";
import Resumen from "./Resumen/Resumen_3";
import useGlobalState from "../../../global_state/globalState";
import { Link } from "react-router";
import Direcciones from "./Datos_direcciones/Direcciones_1";
import Tarjeta from "./Datos_tarjeta/Tarjeta_2";

function FinPedido() {

    const [stages, setStages] = useState(1);
    const { clientData, order, setPayData } = useGlobalState();
    const [direccionEnvio, setDireccionEnvio] = useState();
    const [datosTarjeta, setDatosTarjeta] = useState();
    const [paymentMethod, setPaymentMethod] = useState();

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
            setPayData('setShippingData', direccionEnvio);
        } else if (stage === 2) {
            setPayData('setDataCard', datosTarjeta);
        }
    }

    async function handleSubmitPurchaseInfo() {
        console.log(`Datos de envio: Direccion - ${JSON.stringify(direccionEnvio)} | Tarjeta - ${JSON.stringify(datosTarjeta)}`);

        console.log('Datos en global state: ', order);


        // const requestPay = await fetch('http://localhost:3000/api/Tienda/RealizarCompra', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ clientData, order })
        // });

        // const response = await requestPay.json();
        // console.log('Respuesta de stripe: ', response)

        // if (response.code !== 0) throw new Error('Fallo al realizar el pago.');

        // navigate('/', { state: { msg: 'Has realizado tu compra con éxito' } });
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
                                <Tarjeta onChangeDataCard={onChangeDataCard} />
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
                                    <button className="btn btn-stage" onClick={() => { nextStage(stages) }}>Continuar</button>
                                </div>
                                : stages !== 3 ?
                                    <div className='d-flex flex-row justify-content-end px-2'>
                                        <button className="btn btn-outline-secondary me-2 px-4" onClick={() => setStages(stages - 1)}>Volver</button>
                                        <button className="btn btn-stage" onClick={() => setStages(stages + 1)}>Continuar</button>
                                    </div>
                                    :
                                    <div className="d-flex flex-row justify-content-end px-2 mt-4">
                                        <button className="btn btn-outline-secondary me-2 px-4" onClick={() => setStages(stages - 1)}>Volver</button>
                                    </div>
                        }
                    </div>

                    {/* <div className='p-2'>
                        <h3 className="mt">Método de pago</h3>

                        {paymentMethod === "tarjeta" && (
                            <div className="card-form">
                                <div className="form-group">
                                    <label className="form-label mt-4">Número de tarjeta</label>
                                    <input className="input" id='cardNumber' name='cardNumber' placeholder="1234 5678 9012 3456" onChange={onChangeDataCard} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Mes</label>
                                        <input className="input" id='monthExp' name='monthExp' placeholder="MM" maxLength="2" onChange={onChangeDataCard} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Año</label>
                                        <input className="input" id='yearExp' name='yearExp' placeholder="aaaa" maxLength="4" onChange={onChangeDataCard} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">CVC</label>
                                        <input className="input" id='cvc' name='cvc' placeholder="1234" maxLength="4" onChange={onChangeDataCard} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div> */}
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
                        <span> subtotal</span>
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
