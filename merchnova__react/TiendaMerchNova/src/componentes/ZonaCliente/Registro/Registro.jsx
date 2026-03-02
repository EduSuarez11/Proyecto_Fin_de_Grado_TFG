import { useState } from "react"
import './Registro.css';
import InputHTMLComponent from "../../global_components/InputComponent/InputHTML";

function Registro() {

    const [formRegistro, setFormRegistro] = useState({})

    function onChangeInput(ev) {
        setFormRegistro((stateAnt) => {
            return { ...stateAnt, [ev.target.name]: ev.target.value }
        })
    }


    function handleSubmit(ev) {
        ev.preventDefault();
    }

    return (
        <div className="register-wrapper">
            <div className="register-card">
                <h2 className="text-center register-title">Creando tu Cuenta</h2>
                <form method="POST" onSubmit={handleSubmit}>
                    {
                        ['nombre', 'email', 'password', 'confirmPassword'].map((value, pos) => {
                            <InputHTMLComponent
                                key={pos}
                                id={value}
                                labelInput={value === 'confirmPassword' ? 'Confirmar Contraseña' : value.charAt(0).toUpperCase() + value.slice(1)}
                                nameInput={value}
                                tipo={value === 'email' ? 'email' : (value === 'password' ? 'password' : 'text')}
                                placeholder={value === 'confirmPassword' ? 'Repite tu contraseña' : `Escribe tu ${value}`}
                                change={onChangeInput}
                            />
                        })
                    }

                    <div class="mb-3">
                        <label class="form-label">Género</label>
                        <select class="form-select">
                            <option selected disabled>Selecciona tu género</option>
                            <option>Masculino</option>
                            <option>Femenino</option>
                            <option>Otro género</option>
                        </select>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-custom">Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    )
}