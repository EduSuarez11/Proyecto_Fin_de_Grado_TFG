import { Link } from 'react-router';
import './ErrorToken.css'

function ErrorToken() {
    return (
        <div className="expired-token-container">
            <div className="expired-token-card">
                <div className="expired-icon">
                    <i className="bi bi-shield-lock-fill"></i>
                </div>

                <h2>Enlace expirado</h2>
                <p>El enlace para cambiar tu contraseña ya no es válido o ha expirado.
                    Por seguridad, los enlaces solo pueden utilizarse durante un tiempo limitado.
                </p>

                <div className="expired-actions">
                    <Link to='/Cliente/Login' className="btn btn-purple">Ir a solicitar nuevo enlace</Link>
                    <Link to='/' className="btn btn-outline-purple">Volver al inicio</Link>
                </div>

                <div className="expired-info">
                    <i className="bi bi-info-circle"></i>
                    <span>Si el problema persiste, intenta generar una nueva solicitud de recuperación.</span>
                </div>
            </div>
        </div>
    )
}

export default ErrorToken;
