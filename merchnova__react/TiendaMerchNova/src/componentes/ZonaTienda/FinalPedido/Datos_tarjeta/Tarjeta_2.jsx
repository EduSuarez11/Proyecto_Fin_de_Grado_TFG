import { useState } from 'react';

function Tarjeta({onChangeDataCard}) {

    const [paymentMethod, setPaymentMethod] = useState({tipo: ''});


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
                                    onChangeDataCard(prev => tipo === 'Tarjeta' ? ({ ...prev, tipo: tipo.toLowerCase() }) : ({ tipo: tipo.toLowerCase() }));
                                }}
                            />
                            <label htmlFor={tipo.toLowerCase()}>{tipo}</label>
                        </div>
                    )
                }
            </div>

            {paymentMethod === "tarjeta" && (
                <div className="card-form">
                    <label>Número de tarjeta</label>
                    <input
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        onChange={onChangeDataCard}
                    />

                    <div className="row-card">
                        <div className="col">
                            <label>Fecha expiración</label>
                            <div className="row-exp">
                                <input
                                    className="input"
                                    placeholder="MM"
                                    maxLength="2"
                                    onChange={onChangeDataCard}
                                />
                                <input
                                    className="input"
                                    placeholder="AA"
                                    maxLength="2"
                                    onChange={onChangeDataCard}
                                />
                            </div>
                        </div>

                        <div className="col">
                            <label>CVV</label>
                            <input
                                className="input"
                                placeholder="123"
                                maxLength="4"
                                onChange={onChangeDataCard}
                            />
                        </div>
                    </div>

                    <label>Nombre del titular</label>
                    <input
                        className="input"
                        placeholder="Nombre completo"
                        onChange={onChangeDataCard}
                    />
                </div>
            )}
        </div>
    )
}

export default Tarjeta;
