import './CompraFinalizada.css'
import { Link, useLocation } from "react-router"

function CompraFinalizada() {

    const location = useLocation();
    const {orderId, clientId} = location.state.data;

    return (
        <div className="success-container">

            <div className="success-card">

                <div className="success-icon">✓</div>

                <h1 className="success-title">¡Pago realizado con éxito!</h1>

                <p className="success-text">Tu pedido ha sido procesado correctamente. ¡Muchas gracias por su compra! Disfrutelo.</p>

                <div className="success-info">

                    <div className="info-row">
                        <span>ID Pedido:</span>
                        <strong>{orderId || ''}</strong>
                    </div>

                    <div className="info-row">
                        <span>ID Cliente:</span>
                        <strong>{clientId || ''}</strong>
                    </div>

                </div>

                <div className="success-actions">
                    <Link to="/Portal/Productos" className="btn-primary">Seguir comprando</Link>
                    <Link to="/Cliente/Pedidos" className="btn-secondary">Ver mis pedidos</Link>
                </div>

            </div>

        </div>
    )
}

export default CompraFinalizada;