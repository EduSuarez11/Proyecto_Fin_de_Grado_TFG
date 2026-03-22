import { useLocation, useNavigate } from 'react-router-dom';
import './MensajeSuccess.css';
import { useEffect } from "react";

function MensajeSuccess(props) {
    const location = useLocation();
    const navigate = useNavigate()
    //console.log('Propiedades: ', msg, setLoginSuccess);
    useEffect(() => {
        if (props.msg) {
            const timeMsg = setTimeout(() => {
                props.setState(null);
                // limpiar el state para evitar volver mostrar el mensaje cuando se recarga
                navigate(location.pathname, { replace: true, state: {} });
            }, 3000);
            return () => clearTimeout(timeMsg);
        }

    }, [props.msg]);

    return (
        <div className="alert alert-success d-flex justify-content-center align-items-center gap-2 shadow successMsg">
            <span className="fw-semibold">{props.msg}</span>
        </div>
    );
}

export default MensajeSuccess;
