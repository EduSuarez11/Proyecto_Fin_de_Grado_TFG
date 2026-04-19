import { useLocation } from 'react-router-dom';
import './InputHTML.css';
import { useState } from 'react';

function InputHTMLComponent(props) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordInput = props.nameInput === 'password' || props.nameInput === 'confirmPassword';
    const inputType = isPasswordInput && showPassword ? 'text' : props.tipo;

    return (
        <div className="mb-3">
            <label className="form-label">{props.labelInput} <span className='text-danger'>*</span></label>
            <div className={isPasswordInput ? 'input-password' : ''}>
                <input
                    className="form-control"
                    type={inputType}
                    id={props.id}
                    name={props.nameInput}
                    placeholder={props.placeholder}
                    onChange={props.change} />
                {
                    isPasswordInput && (
                        showPassword ? 
                        <i className='fa-solid fa-eye-slash eye-icon' onClick={() => setShowPassword(false)}></i>
                        :
                        <i className="fa-solid fa-eye eye-icon" onClick={() => setShowPassword(true)}></i>
                    )
                }
            </div>

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
