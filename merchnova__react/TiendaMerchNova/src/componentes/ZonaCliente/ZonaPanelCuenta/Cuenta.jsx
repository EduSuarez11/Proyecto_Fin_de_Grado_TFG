import './Cuenta.css';
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import useGlobalState from "../../../global_state/globalState";

function Cuenta() {
    const { logOut } = useGlobalState();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-8">
                    <Outlet/>
                </div>

                <div className="col-lg-4">
                    <div className="card p-3">
                        <h4 className="px-3 mb-3 fw-bold">Mi Cuenta</h4>
                        <div className="list-group list-group-flush">
                            {
                                [
                                    { name: 'Perfil', route: '/Cliente/Cuenta/Perfil', icon: 'bi bi-person me-2' },
                                    { name: 'Mis Pedidos', route: '/Cliente/Cuenta/Pedidos', icon: 'bi bi-box-seam me-2' },
                                    { name: 'Mis Direcciones', route: '/Cliente/Cuenta/Direcciones', icon: 'bi bi-geo-alt me-2' },
                                    { name: 'Mi Carrito', route: '/Cliente/Cuenta/MiCarrito', icon: 'bi bi-cart3 me-2' },
                                ].map((element, index) =>
                                    <Link to={element.route} key={index} className={`list-group-item list-group-item-action border-0 py-3 sidebar-link ${location.pathname === element.route ? 'active-link' : ''}`}>
                                        <i className={element.icon}></i> {element.name}
                                    </Link>
                                )
                            }
                            <hr className="text-muted my-2" />
                            <button onClick={() => { logOut(); navigate('/', { state: { msg: 'Has cerrado sesión' } }) }}
                                className="list-group-item list-group-item-action border-0 py-3 text-danger fw-bold sidebar-link-danger">
                                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cuenta;