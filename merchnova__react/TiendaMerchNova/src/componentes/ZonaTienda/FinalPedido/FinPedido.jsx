import useGlobalState from '../../../global_state/globalState';
import './FinPedido.css';
import { useState } from "react";

function FinPedido() {
    const [paymentMethod, setPaymentMethod] = useState();
    const { order } = useGlobalState();
    console.log('Pedidos en el encargo: ', order);
    return (
        <div className="checkout-container">
            <div className="checkout-grid">
                <div className="checkout-left">
                    <div className='p-2 mb-4'>
                        <h3>Dirección de envío</h3>

                        <input className="input" id='nombreCompleto' name='nombreCompleto' placeholder="Nombre" />
                        <input className="input" id='direccion' name='direccion' placeholder="Dirección" />
                        <input className="input" id='ciudad' name='ciudad' placeholder="Ciudad" />
                        <input className="input" id='codigoPostal' name='codigoPostal' placeholder="Código postal" />
                    </div>

                    <div className='p-2'>
                        <h3 className="mt">Método de pago</h3>
                        <div className="payment-options">
                            <div className={`payment-card ${paymentMethod === "card" ? "active" : ""}`} onClick={() => setPaymentMethod("card")}>
                                Tarjeta
                            </div>

                            <div className={`payment-card ${paymentMethod === "paypal" ? "active" : ""}`} onClick={() => setPaymentMethod("paypal")}>
                                PayPal
                            </div>
                        </div>


                        {paymentMethod === "card" && (
                            <div className="card-form">
                                <input className="input" placeholder="Número de tarjeta" />
                                <input className="input" placeholder="MM/AA" />
                                <input className="input" placeholder="CVV" />
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

                    <button className="pay-btn">Finalizar compra</button>
                </div>
            </div>
        </div>
    );
}

export default FinPedido;
