import './CompraFinalizada.css'
import { Link, useLocation, useParams, useSearchParams } from "react-router"
import useGlobalState from '../../../../global_state/globalState';

function CompraFinalizada() {
    const [params] = useSearchParams();
    const orderId = params.get('orderId');
    const clientId = params.get('clientId');

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
                    <Link to="/Portal/Productos" className="btn-primary">Mirar más productos</Link>
                    <Link to="/Cliente/Cuenta/Pedidos" className="btn-vist">Ver mis pedidos</Link>
                </div>

            </div>

        </div>
    )
}

export default CompraFinalizada;