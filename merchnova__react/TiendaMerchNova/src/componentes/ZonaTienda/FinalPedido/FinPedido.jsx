import { useLoaderData, useNavigate } from 'react-router-dom';
import useGlobalState from '../../../global_state/globalState';
import './FinPedido.css';
import { useState } from "react";

function FinPedido() {
    const countries = useLoaderData();
    const navigate = useNavigate();
    const { setOrder, client, order } = useGlobalState();
    const [paymentMethod, setPaymentMethod] = useState();
    const [direccionEnvio, setDireccionEnvio] = useState();
    const [datosTarjeta, setDatosTarjeta] = useState();
    //console.log('Pedidos en el encargo: ', order);


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

    async function handleSubmitPurchaseInfo() {
        console.log(`Datos de envio: Direccion - ${JSON.stringify(direccionEnvio)} | Tarjeta - ${JSON.stringify(datosTarjeta)}`);

        setOrder('setShippingData', direccionEnvio);
        setOrder('setDataCard', datosTarjeta);

        const requestPay = await fetch('http://localhost:3000/api/Tienda/RealizarCompra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ client, order })
        });

        const response = await requestPay.json();

        if (response.code !== 0) throw new Error('Fallo al realizar el pago.');

        navigate('/', { state: { msg: 'Has realizado tu compra con éxito' } });
    }

    return (
        <div className="checkout-container">
            <div className="checkout-grid">
                <div className="checkout-left">
                    <div className="px-2 py-3 mb-4">

                        <h3 className="mb-4">Dirección de envío</h3>

                        <div className="form-group">
                            <label className="form-label">Nombre completo</label>
                            <input className="input" id="nombreCompleto" name="nombreCompleto" placeholder="Ej: Juan Pérez" onChange={onChangeAddress} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Dirección</label>
                            <input className="input" id="calle" name="calle" placeholder="Calle, número, piso..." onChange={onChangeAddress} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Municipio</label>
                                <input className="input" id="municipio" name="municipio" placeholder="Municipio" onChange={onChangeAddress} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Provincia</label>
                                <input className="input" id="provincia" name="provincia" placeholder="Provincia" onChange={onChangeAddress} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Código Postal</label>
                                <input className="input" id="codigoPostal" name="codigoPostal" placeholder="Código postal" onChange={onChangeAddress} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">País</label>
                            <select id='pais' name="pais" className="input" onChange={onChangeAddress}>
                                <option value="">Elige tu país</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country.cca2}>
                                        {country.name.common}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className='p-2'>
                        <h3 className="mt">Método de pago</h3>
                        <div className="payment-options">
                            <div className={`payment-card ${paymentMethod === "card" ? "active" : ""}`} onClick={() => { setPaymentMethod("card"); setDatosTarjeta({ ...datosTarjeta, tipo: 'tarjeta' }) }}>
                                Tarjeta
                            </div>

                            <div className={`payment-card ${paymentMethod === "paypal" ? "active" : ""}`} onClick={() => { setPaymentMethod("paypal"); setDatosTarjeta({ tipo: 'paypal' }) }}>
                                PayPal
                            </div>
                        </div>


                        {paymentMethod === "card" && (
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
                    </div>
                </div>

                <div className="checkout-right">
                    <h3>Resumen del pedido</h3>

                    {
                        order.items.map((item, i) =>
                            <div className="product" key={i}>
                                <span>{item.product.nombre}</span>
                                <span>+ {item.product.precio}</span>
                            </div>
                        )
                    }

                    <div className="product text-danger">
                        <span>Gastos de envío</span>
                        <span>+ 1.07€</span>
                    </div>

                    {/* <div className="product">
                        <span>Taza merch</span>
                        <span>9.99€</span>
                    </div> */}

                    <hr />

                    <div className="total">
                        <span>Total</span>
                        <span>{order.subtotal}</span>
                    </div>

                    <button className="pay-btn" onClick={handleSubmitPurchaseInfo}>Finalizar compra</button>
                </div>
            </div>
        </div>
    );
}

export default FinPedido;
