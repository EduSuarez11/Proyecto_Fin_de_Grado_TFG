
function Tarjeta({ onChangeDataCard, setDatosTarjeta, setPaymentMethod, paymentMethod }) {
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

            <div className='p-2'>

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
            </div>
        </div>
    )
}

export default Tarjeta;
