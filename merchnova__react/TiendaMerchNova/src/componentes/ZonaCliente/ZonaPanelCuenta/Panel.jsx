import { Link } from "react-router-dom";

function Panel({ order, clientData }) {
    return (
        <div className="d-flex align-items-center gap-3 user-menu">
            <Link to='/Cart' className="cart-icon">
                <i className="bi bi-cart3">
                    <span className="position-absolute translate-middle badge bg-danger size-qty">
                        {order.items.length}
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
                        ["Perfil", "Mis pedidos", "Configuración", "Cerrar Sesión"].map((elemento, index) =>
                            <>
                                <li key={index}>
                                    <Link className={`dropdown-item ${elemento === 'Cerrar Sesión' && 'text-danger'}`} to={`/Cliente/${elemento.includes(" ") ? elemento.replace(/\s+/g, "") : elemento}`}>
                                        {elemento}
                                    </Link>
                                </li>
                                {
                                    elemento === 'Configuración' && <li><hr className="dropdown-divider" /></li>
                                }
                            </>
                        )
                    }

                    {/* <li>
                        <a className="dropdown-item" href="#">Perfil</a>
                    </li>

                    <li>
                        <a className="dropdown-item" href="#">Mis pedidos</a>
                    </li>

                    <li>
                        <a className="dropdown-item" href="#">Configuración</a>
                    </li>

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <button className="dropdown-item text-danger">Cerrar sesión</button>
                    </li> */}
                </ul>
            </div>
        </div >
    );
}

export default Panel;