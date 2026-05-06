import { useState } from 'react';
import './NuevaPassword.css';
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';

function NuevaPassword() {
    const [email, setEmail] = useState({ email: '' });
    const [messageSendEmail, setMessageSendEmail] = useState('');
    const [error, setError] = useState('');

    async function handleSetPassword() {
        //console.log('Email: ', email);
        const response = await request_profile.set_data_profile(email);
        //console.log('Respuesta del envio del email: ', response);
        if (response.code !== 0) {
            setError(response.message);
            return;
        }
        setMessageSendEmail(response.message);
    }
    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2 className="reset-title fw-bold text-center">Recuperar contraseña</h2>
                <div className='d-flex justify-content-center'>
                    {error !== '' && <span className="alert alert-danger small">{error}</span>}
                    {messageSendEmail !== '' && <span className="alert alert-success small">{messageSendEmail}</span>}
                </div>
                <p className="reset-description text-secondary" >
                    Introduce tu correo electrónico y te enviaremos un enlace
                    para restablecer tu contraseña de forma segura.
                </p>

                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" className="form-control reset-input" name='email' id='email' placeholder="ejemplo@email.com" onChange={(ev) => setEmail({ [ev.target.name]: ev.target.value })} />
                </div>

                <div className="d-grid">
                    <button className="btn btn-reset fw-semibold" onClick={handleSetPassword}>Enviar enlace</button>
                </div>
            </div>
        </div>
    )
}

export default NuevaPassword;
