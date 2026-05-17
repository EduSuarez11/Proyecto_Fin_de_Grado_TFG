import './Privacidad.css'
import useGlobalState from '../../../../global_state/globalState'
import { useState } from 'react';
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';

function Privacidad() {
    const { clientData, setClientData } = useGlobalState();
    const [privacity, setPrivacity] = useState({
        visibility: clientData?.cuenta?.visibilidad === 'publico' ? true : false,
        notification: clientData?.cuenta?.notificaciones ? true : false
    });

    async function handlePrivacity(ev) {
        console.log(ev.target.name, ev.target.checked);
        const updatedPrivacity = {
            ...privacity,
            [ev.target.name]: ev.target.checked
        };
        setPrivacity(updatedPrivacity);

        const response = await request_profile.request_set_privacity(clientData, updatedPrivacity);
        console.log('Respuesta al cambiar privacidad: ', response.dataUpdate.cuenta.visibilidad);
        setClientData(response.dataUpdate);
    }

    return (
        <div className="privacy-container container">
            <div className="privacy-header">
                <h2 className='super-title fw-bold'>Privacidad y seguridad</h2>
                <p className='text-secondary'>Controla cómo se muestra tu cuenta y cómo se gestionan tus datos</p>
            </div>

            <div className="privacy-card">
                <div className="privacy-item">
                    <div className="privacy-left">
                        <i className="bi bi-eye"></i>
                        <div>
                            <h6>Cuenta pública / Cuenta privada</h6>
                            <span className='text-secondary'>Permite que otros usuarios vean tu perfil</span>
                        </div>
                    </div>

                    <div className="form-check form-switch">
                        <input className="form-check-input input-privacity" name='visibility' type="checkbox" checked={privacity.visibility} onChange={handlePrivacity} />
                    </div>
                </div>

                <div className="privacy-item">
                    <div className="privacy-left">
                        <i className="bi bi-envelope"></i>
                        <div>
                            <h6>Notificaciones por email</h6>
                            <span>Recibe información sobre pedidos y novedades</span>
                        </div>
                    </div>

                    <div className="form-check form-switch">
                        <input className="form-check-input input-privacity" name='notification' type="checkbox" checked={privacity.notification} onChange={handlePrivacity} />
                    </div>
                </div>

                <div className="privacy-item no-hover">
                    <div className="privacy-left">
                        <i className="bi bi-shield-check"></i>
                        <div>
                            <h6>Sesiones activas</h6>
                            <span>Gestiona los dispositivos donde has iniciado sesión</span>
                        </div>
                    </div>
                    <button className="btn btn-outline-purple btn-sm">Ver sesiones</button>
                </div>

                <div className="privacy-info-box">
                    <i className="bi bi-info-circle"></i>
                    <span>Tu privacidad es importante. Puedes modificar estas opciones en cualquier momento.</span>
                </div>
            </div>
        </div>
    )
}

export default Privacidad;
