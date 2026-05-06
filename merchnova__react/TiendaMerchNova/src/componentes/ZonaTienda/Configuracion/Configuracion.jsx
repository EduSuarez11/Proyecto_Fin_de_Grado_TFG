import './Configuracion.css';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

function Configuracion() {
    const navigate = useNavigate();
    const route = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="container-fluid p-4">
            <div className='row'>
                <div className='col-lg-3 p-4'>
                    <div className="settings-header">
                        <h2 className='title-header fw-bold fs-3'>Configuración</h2>
                        <p className=''>Gestiona tu cuenta y preferencias</p>
                    </div>

                    <div className="card">
                        {
                            [
                                { subtitle: 'Mi perfil', route: '/Cliente/Configuración/InfoPerfil', icon: 'bi bi-person-circle bg-shop', description: 'Ver y editar tu información personal' },
                                { subtitle: 'Cambiar contraseña', route: '/Cliente/Configuración/CambiarPassword', icon: 'bi bi-lock bg-shop', description: 'Actualiza tu contraseña de acceso' },
                                { subtitle: 'Direcciones', route: '/Cliente/Cuenta/MisDirecciones', icon: 'bi bi-geo-alt bg-shop', description: 'Gestiona tus direcciones de envío' },
                                { subtitle: 'Privacidad', route: '/Cliente/Configuración/Privacidad', icon: 'bi bi-shield-lock bg-shop', description: 'Gestiona la visibilidad de tu cuenta' },
                                { subtitle: 'Eliminar cuenta', route: '/Cliente/Configuración/EliminarCuenta', icon: 'bi bi-trash', description: 'Esta acción es permanente' }
                            ].map((element, pos) =>
                                <Link to={element.route} className={element.subtitle !== 'Eliminar cuenta' ? 'settings-item' : 'settings-item danger'} key={pos}>
                                    <div className="settings-left">
                                        <i className={element.icon}></i>
                                        <h6 className={element.subtitle !== 'Eliminar cuenta' ? 'super-title' : 'text-danger'}>{element.subtitle}</h6>
                                        <span>{element.description}</span>
                                    </div>

                                    {element.subtitle !== 'Privacidad'}
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            )
                        }
                    </div>
                </div>

                <div className='col-lg-9'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Configuracion;
