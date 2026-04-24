import { useState } from "react"
import './Registro.css';
import InputHTMLComponent from '../../global_components/InputComponent/InputHTML'
import { request_auth } from "../../Servicios/peticiones_auth_frontend/request_auth";

function Registro() {
    const [formRegistro, setFormRegistro] = useState({})
    const [emailSent, setEmailSent] = useState();
    const [messages, setMessages] = useState();
    const [codeResponse, setCodeResponse] = useState();

    const [validationRegistro, setValidationRegistro] = useState({
        lengthPassword: false,
        email: false,
        number: false,
        symbol: false
    });

    const checkEmail = (password) => {
        const emailValidation = {
            email: /^\S+@\S+\.\S+$/.test(password),
        }

        setValidationRegistro((prev) => ({
            ...prev,
            ...emailValidation
        }));
    }

    const checkPassword = (password) => {
        const newValidation = {
            lengthPassword: password.length >= 9,
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            number: /[0-9]/.test(password)
        };

        setValidationRegistro((prev) => ({
            ...prev,
            ...newValidation
        }));
    }

    function onChangeInput(ev) {
        console.log('Validation: ', !validationRegistro)
        setFormRegistro({
            ...formRegistro,
            [ev.target.name]: ev.target.value
        })

        if (ev.target.name === 'password') checkPassword(ev.target.value);
        if (ev.target.name === 'email') checkEmail(ev.target.value);
    }

    async function handleSubmit(ev) {
        try {
            // Peticion al servidor con los datos del formulario
            const data = request_auth.request_register(formRegistro);

            if (data.code !== 0) {
                setCodeResponse(`${data.code}`);
                setMessages(`${data.message}`);
            } else {
                setCodeResponse(`${data.code}`);
                setMessages(`${data.message}`);
            }
        } catch (error) {
            console.log('Error en el Registro: ', error);
        }
    }

    return (
        <div className="register-wrapper mt-5">
            <div className="register-card">
                <h2 className="text-center register-title mb-4">Registrate</h2>
                <div className="d-flex justify-content-center">
                    {messages != null ? <span className={codeResponse != 0 ? 'alert alert-danger small' : 'alert alert-success small'}>{messages}</span> : null}

                </div>
                <form method="POST">
                    {
                        ['nombre', 'email', 'password', 'confirmPassword'].map((value, pos) => (
                            <InputHTMLComponent
                                key={pos}
                                id={value}
                                labelInput={value === 'confirmPassword' ? 'Confirmar Contraseña' : value.charAt(0).toUpperCase() + value.slice(1)}
                                nameInput={value}
                                tipo={value === 'email' ? 'email' : (value === 'password' || value === 'confirmPassword' ? 'password' : 'text')}
                                placeholder={value === 'confirmPassword' ? 'Repite tu contraseña' : `Escribe tu ${value}`}
                                change={onChangeInput}
                                form={formRegistro}
                                validation={validationRegistro}
                                setValidation={setValidationRegistro} />
                        ))
                    }

                    <div className="mb-3">
                        <label className="form-label">Género</label>
                        <select defaultValue='' name="genero" className="form-select" onChange={onChangeInput}>
                            <option value="">Selecciona tu género</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro género</option>
                            <option value="neutro">Prefiero no decirlo</option>
                        </select>
                    </div>
                    <div className="d-grid">
                        {
                            validationRegistro.number && validationRegistro.symbol && validationRegistro.lengthPassword && validationRegistro.email ?
                                <button type="button" className="btn btn-custom" onClick={handleSubmit}>Registrarse</button>
                                :
                                <button type="button" className="btn btn-custom" disabled onClick={handleSubmit}>Registrarse</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registro