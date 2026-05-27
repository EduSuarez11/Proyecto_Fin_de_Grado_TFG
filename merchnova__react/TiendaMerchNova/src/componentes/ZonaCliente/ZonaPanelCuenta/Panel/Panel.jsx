import { Link, useNavigate } from "react-router-dom";

function Panel({ order, clientData, logOut }) {
    const navigate = useNavigate();

    const getRuta = (elemento) => {
        if (elemento === 'Mis Pedidos') return '/Cliente/Cuenta/Pedidos';
        if (elemento === 'Panel de Clientes') return '/Cliente/Cuenta/PanelClientes';
        if (elemento === 'Configuración') return '/Cliente/Configuración';
        return `/Cliente/Cuenta/${elemento}`;
    };

    //console.log('Cliente_ ', clientData);
    return (
        <div className="d-flex align-items-center gap-3 user-menu">
            <Link to='/Portal/Cart' className="cart-icon">
                <i className="bi bi-cart3">
                    <span className="position-absolute translate-middle badge bg-danger size-qty">
                        {clientData?.carrito?.itemsPedido.length || 0}
                    </span>
                </i>
            </Link>

            <div className="dropdown">
                <button
                    className="btn d-flex align-items-center gap-2 user-avatar-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <img
                        src={clientData.cuenta.imagenCuenta}
                        referrerPolicy="no-referrer"
                        alt="avatar usuario"
                        className="rounded-circle"
                        width="40"
                        height="40" />

                    <span className="fw-semibold text-white">{clientData.nombreCompleto}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">

                    <li className="px-3 py-2 border-bottom">
                        <div className="fw-semibold">{clientData.nombreCompleto}</div>
                        <small className="text-muted">Mi cuenta</small>
                    </li>
                    {
                        ["Perfil", "Mis Pedidos", "Panel de Clientes", "Configuración", "Cerrar Sesión"]
                            .filter(elemento => elemento !== 'Panel de Clientes' || clientData.cuenta.rol === 'ADMINISTRADOR')
                            .map((elemento, index) =>
                                <li key={index}>
                                    {elemento === 'Cerrar Sesión' ?
                                        <button className='dropdown-item text-danger'
                                            onClick={() => {
                                                logOut();
                                                sessionStorage.removeItem("token");
                                                navigate('/Cliente/TipoLogin', { state: { msg: 'Has cerrado sesión' } });
                                            }}>
                                            {elemento}
                                        </button>
                                        :
                                        <Link className='dropdown-item' to={getRuta(elemento)}>
                                            {elemento}
                                        </Link>
                                    }
                                    {elemento === 'Configuración' && <hr className="dropdown-divider" />}
                                </li>

                            )
                    }
                </ul>
            </div>
        </div >
    );
}

export default Panel;