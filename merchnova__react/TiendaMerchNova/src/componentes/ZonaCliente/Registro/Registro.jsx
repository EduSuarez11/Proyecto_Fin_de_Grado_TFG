import { useState } from "react"
import './Registro.css';
import InputHTMLComponent from '../../global_components/InputComponent/InputHTML'

function Registro() {

    const [formRegistro, setFormRegistro] = useState({})

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
            console.log('Datos form: ', formRegistro)

            const response = await fetch('http://localhost:3000/api/Cliente/Registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formRegistro)
            });

            const data = await response.json();
            console.log('Respuesta del servidor: ', data.message);
        } catch (error) {
            console.log('Error en el Registro: ', error);
        }
    }

    return (
        <div className="register-wrapper mt-4">
            <div className="register-card">
                <h2 className="text-center register-title mb-4">Registrate</h2>
                <form method="POST">
                    {
                        ['nombre', 'email', 'password', 'confirmPassword'].map((value, pos) => (
                            <InputHTMLComponent
                                key={pos}
                                id={value}
                                labelInput={value === 'confirmPassword' ? 'Confirmar Contraseña' : value.charAt(0).toUpperCase() + value.slice(1)}
                                nameInput={value}
                                tipo={value === 'email' ? 'email' : (value === 'password' ? 'password' : 'text')}
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
                            <option value='' selected>Selecciona tu género</option>
                            <option>Masculino</option>
                            <option>Femenino</option>
                            <option>Otro género</option>
                        </select>
                    </div>
                    <div className="d-grid">
                        {
                            validationRegistro.number && validationRegistro.symbol && validationRegistro.lengthPassword && validationRegistro.email ?
                                <button type="submit" className="btn btn-custom" onClick={handleSubmit}>Registrarse</button>
                                :
                                <button type="submit" className="btn btn-custom" disabled onClick={handleSubmit}>Registrarse</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registro