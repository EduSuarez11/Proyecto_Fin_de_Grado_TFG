import './CompraCancelada.css'
import { Link } from "react-router";

function CompraCancelada() {
    return(
        <div className="cancel-container">
            <div className="cancel-card">
                <div className="cancel-icon">✕</div>
                <h1 className="cancel-title">Pago cancelado</h1>

                <p className="cancel-text">Tu compra no se ha completado. No se ha realizado ningún cobro y tu carrito sigue disponible.</p>

                <div className="cancel-box">
                    <p>Puedes volver al carrito para intentarlo de nuevo o seguir navegando por la tienda.</p>
                </div>

                <div className="cancel-actions">
                    <Link to="/Portal/Cart" className="btn-primary">Volver a intentarlo</Link>
                    <Link to="/" className="btn-secondary">Volver a inicio</Link>
                </div>
            </div>
        </div>
    )
}

export default CompraCancelada;
