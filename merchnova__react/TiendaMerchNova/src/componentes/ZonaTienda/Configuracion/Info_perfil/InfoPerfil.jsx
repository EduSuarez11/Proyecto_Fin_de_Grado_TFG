import { Link } from 'react-router';
import useGlobalState from '../../../../global_state/globalState';
import './InfoPerfil.css'

function InfoPerfil() {
    const { clientData } = useGlobalState();

    const fecha = new Date(clientData.cuenta.creacionCuenta);
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = fecha.getFullYear();
    const fechaCreacionCuenta = `${day}/${month}/${year}`

    return (
        <div className="account-info-container container">

            {/* HEADER */}
            <div className="account-header">
                <h2 className='super-title fw-bold ms-2'>Información de la cuenta</h2>
                <p className='text-secondary ms-2'>Consulta tus datos personales registrados</p>
            </div>

            <div className="account-card">
                <div className="account-top">
                    <div className="account-avatar">
                        <img src={clientData.cuenta.imagenCuenta} alt="avatar" />
                    </div>

                    <div className="account-main-info">
                        <h4 className='title-info-account fw-semibold'>{clientData.nombreCompleto}</h4>
                        <span className='me-3'>{clientData.cuenta.email}</span>

                        <div className="account-badge">{clientData.cuenta.tipo}</div>
                    </div>

                </div>

                <div className="account-details">
                    <div className="account-item">
                        <span className="label">Género</span>
                        <strong>{clientData.cuenta.genero || 'Sin añadir'}</strong>
                    </div>

                    <div className="account-item">
                        <span className="label">Teléfono</span>
                        <strong>{clientData.cuenta.telefono || 'Sin añadir'}</strong>
                    </div>

                    <div className="account-item">
                        <span className="label">Descripción</span>
                        <strong>{clientData.cuenta.sobreMi || 'Sin añadir'}</strong>
                    </div>

                    <div className="account-item">
                        <span className="label">Fecha de registro</span>
                        <strong>{clientData.cuenta.creacionCuenta !== null ? fechaCreacionCuenta : 'Sin añadir'}</strong>
                    </div>

                    <div className="account-item">
                        <span className="label">Direcciones guardadas</span>
                        <strong>{clientData.direcciones?.length || 0}</strong>
                    </div>

                    <div className="account-item">
                        <span className="label">Pedidos realizados</span>
                        <strong>{clientData.pedidos?.length || 0}</strong>
                    </div>

                </div>

                <div className="account-actions">
                    <Link to='/Cliente/Cuenta/Perfil' className="btn btn-edit-profile">Editar perfil</Link>
                </div>
            </div>
        </div>
    )
}

export default InfoPerfil;
