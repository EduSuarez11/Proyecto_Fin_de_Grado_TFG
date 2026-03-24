import './MiCarritoCuenta.css';
import useGlobalState from "../../../../global_state/globalState";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function CarritoCuenta() {
    const { order, logOut, setOrder } = useGlobalState();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card p-4">
                        <h4 className="fw-bold mb-4">Tu carrito</h4>
                        {
                            order.items.length === 0 ? (
                                <div className="text-center py-5">
                                    <h5 className="text-muted">Tu carrito está vacío</h5>
                                    <button className="btn btn-purple mt-3">
                                        Explorar productos
                                    </button>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-lg-8">
                                        {
                                            order.items.map((i, index) => (
                                                <div key={index} className="cart-item d-flex align-items-center mb-3 p-3">
                                                    <img
                                                        src={`http://localhost:3000${i.product.imagen}`}
                                                        alt={i.product.nombre}
                                                        className="cart-img me-3"
                                                    />

                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 fw-semibold">{i.product.nombre}</h6>
                                                        <span className="text-muted small">
                                                            {i.product.precio}€
                                                        </span>

                                                        <div className="quantity-control mt-2">
                                                            <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => setOrder('updateOnCart', { product: i.product, quantity: i.quantity - 1 })} style={{ width: "32px", height: "32px" }}>−</button>
                                                            <span className="fw-semibold" style={{ minWidth: "20px", textAlign: "center" }}>
                                                                {i.quantity}
                                                            </span>
                                                            <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => setOrder('updateOnCart', { product: i.product, quantity: i.quantity + 1 })} style={{ width: "32px", height: "32px" }}>+</button>
                                                        </div>
                                                    </div>

                                                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => { setOrder('deleteToCart', {product: i.product, quantity: 0}) }}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="cart-summary p-3">

                                            <h5 className="fw-bold mb-3">Resumen</h5>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Subtotal</span>
                                                <span>{order.subtotal}€</span>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Envío</span>
                                                <span>1,03 €</span>
                                            </div>

                                            <hr />

                                            <div className="d-flex justify-content-between fw-bold mb-3">
                                                <span>Total</span>
                                                <span>{order.subtotal + 1.03}€</span>
                                            </div>

                                            <button className="btn btn-purple w-100">
                                                Finalizar compra
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card p-3">
                        <h4 className="px-3 mb-3 fw-bold">Mi Cuenta</h4>
                        <div className="list-group list-group-flush">
                            {
                                [
                                    { name: 'Perfil', route: '/Cliente/Perfil', icon: 'bi bi-person me-2' },
                                    { name: 'Mis Pedidos', route: '/Cliente/Pedidos', icon: 'bi bi-box-seam me-2' },
                                    { name: 'Mis Direcciones', route: '/Cliente/Direcciones', icon: 'bi bi-geo-alt me-2' },
                                    { name: 'Mi Carrito', route: '/Cliente/MiCarrito', icon: 'bi bi-cart3 me-2' },
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
    );
}

export default CarritoCuenta;
