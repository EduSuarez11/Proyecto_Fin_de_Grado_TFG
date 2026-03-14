import { useLocation } from 'react-router-dom';
import './InputHTML.css';

function InputHTMLComponent(props) {
    return (
        <div className="mb-3">
            <label className="form-label">{props.labelInput}</label>
            <input
                className="form-control"
                type={props.tipo}
                id={props.id}
                name={props.nameInput}
                placeholder={props.placeholder}
                onChange={props.change} />

            {/* Validacion de email */}
            {props.nameInput === 'email' && props.form.email && (
                <ul className="small mt-2 list-unstyled">
                    <li className={props.validation.email ? "text-success" : "text-danger"}>
                        {props.validation.email ? "✅ Formato de email correcto" : "❌ Formato de email incorrecto"}
                    </li>
                </ul>
            )}

            {/* Validaciones de contraseña */}
            {props.nameInput === 'password' && props.form.password && (
                <ul className="small mt-2 list-unstyled">
                    <li className={props.validation.lengthPassword ? "text-success" : "text-danger"}>
                        {props.validation.lengthPassword ? "✅ Mínimo 8 caracteres" : "❌ Mínimo 8 caracteres"}
                    </li>

                    <li className={props.validation.number ? "text-success" : "text-danger"}>
                        {props.validation.number ? "✅ Contiene al menos 1 número" : "❌ Debe contener al menos 1 número"}
                    </li>

                    <li className={props.validation.symbol ? "text-success" : "text-danger"}>
                        {props.validation.symbol ? "✅ Contiene al menos 1 símbolo" : "❌ Debe contener al menos 1 símbolo"}
                    </li>
                </ul>
            )}



        </div>
    )
}

export default InputHTMLComponent;
