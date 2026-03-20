import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import useGlobalState from '../../../../global_state/globalState';

function Header() {
    const route = useLocation();
    const { clientData } = useGlobalState();
    const { order } = useGlobalState();
    const showButtonsSession = (routeComponent) => routeComponent !== '/Cliente/Registro' && routeComponent !== '/Cliente/Login';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-merchnova px-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center fw-bold logo-mn">
                    <img src="/logo_images/logo_tienda.png" className="logo-navbar rounded-circle rounded-5" alt="MerchNova logo" />
                    <span className="ms-2">MerchNova</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {showButtonsSession(route.pathname) ?

                    <div className="collapse navbar-collapse" id="navbarContent">
                        <form className="d-flex mx-auto search-bar">
                            <input className="form-control me-2" type="search" placeholder="Buscar productos..." />
                            <button className="btn btn-light" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </form>


                        {
                            clientData == null ?
                                <div className="d-flex align-items-center gap-3">
                                    <Link to='/Cart' className="cart-icon">
                                        <i className="bi bi-cart3">
                                            <span className="position-absolute translate-middle badge bg-danger size-qty">
                                                {order.items.length}
                                            </span>
                                        </i>
                                    </Link>

                                    <Link to="/Cliente/Login">
                                        <button className="btn btn-outline-light btn-sm">
                                            Iniciar sesión
                                        </button>
                                    </Link>

                                    <Link to="/Cliente/Registro">
                                        <button className="btn btn-light btn-sm fw-semibold">
                                            Registrarse
                                        </button>
                                    </Link>
                                </div>
                                :
                                <div className="d-flex align-items-center gap-3 user-menu">
                                    <Link to='/Cart' className="cart-icon">
                                        <i className="bi bi-cart3">
                                            <span className="position-absolute translate-middle badge bg-danger size-qty">
                                                {order.items.length}
                                            </span>
                                        </i>
                                    </Link>
                                    {/* Avatar */}
                                    <div className="dropdown">
                                        <button
                                            className="btn d-flex align-items-center gap-2 user-avatar-btn"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <img
                                                src={clientData.cuenta.imagenCuenta}
                                                alt="avatar usuario"
                                                className="rounded-circle"
                                                width="40"
                                                height="40"
                                            />

                                            <span className="fw-semibold text-white">{clientData.nombreCompleto}</span>
                                        </button>

                                        {/* Dropdown usuario */}
                                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">

                                            <li className="px-3 py-2 border-bottom">
                                                <div className="fw-semibold">{clientData.nombreCompleto} </div>
                                                <small className="text-muted">Mi cuenta</small>
                                            </li>

                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Perfil
                                                </a>
                                            </li>

                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Mis pedidos
                                                </a>
                                            </li>

                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Configuración
                                                </a>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button className="dropdown-item text-danger">
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                        }

                    </div>
                    :
                    <Link to='/'>
                        <button className="btn btn-light btn-sm fw-semibold">
                            Volver
                        </button>
                    </Link>

                }
            </div>
        </nav>
    );
}

export default Header;
