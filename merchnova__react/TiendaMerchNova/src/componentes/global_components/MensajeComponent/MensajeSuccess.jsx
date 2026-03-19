import './MensajeSuccess.css'; 
import { useEffect } from "react";

function MensajeSuccess(props) {
    console.log('Propiedades: ', props);
    useEffect(() => {
        if (props.msg) {
            const timeMsg = setTimeout(() => {
            props.setAdd(null);
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
