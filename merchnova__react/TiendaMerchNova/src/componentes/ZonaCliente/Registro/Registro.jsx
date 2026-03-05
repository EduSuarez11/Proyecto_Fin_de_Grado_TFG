import { useState } from "react"
import './Registro.css';
import InputHTMLComponent from '../../global_components/InputComponent/InputHTML'

function Registro() {

    const [formRegistro, setFormRegistro] = useState({})

    function onChangeInput(ev) {
        setFormRegistro((stateAnt) => {
            return { ...stateAnt, [ev.target.name]: ev.target.value }
        })
    }

    async function handleSubmit(ev) {
        try {
            ev.preventDefault();
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
        <div className="register-wrapper">
            <div className="register-card">
                <h2 className="text-center register-title">Creando tu Cuenta</h2>
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
                            />

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
                        <button type="submit" className="btn btn-custom" onClick={handleSubmit}>Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registro