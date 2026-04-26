import './MiCarritoCuenta.css';
import useGlobalState from "../../../../global_state/globalState";
import { Link } from 'react-router';
import { request_cart } from '../../../Servicios/peticiones_carrito/request_cart';

function CarritoCuenta() {
    const { setOrder, clientData, order, setClientData } = useGlobalState();

    async function deleteOnCart({ item }) {
        const newCartAfter = await request_cart.cart_persistence({ clientData, order: item.producto, quantity: item.quantity }, '/Eliminar');
        //console.log('Producto eliminado de cart: ', newCartAfter);
        setClientData(newCartAfter.data);
        //console.log('Item a eliminar: ', item.product);
    }

    //const subtotal = clientData === null ? null : clientData.carrito.itemsPedido.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);

    async function updateOnCart({ item, quantity }) {
        const updateCart = await request_cart.cart_persistence({ clientData, order: item.producto, quantity }, '/Actualizar');
        console.log('Carrito actualizado: ', updateCart);
        setClientData(updateCart.data);
    }

    return (
        <div className="card p-4">
            <h4 className="fw-bold mb-4">Tu carrito</h4>
            {
                clientData.carrito.itemsPedido.length === 0 ? (
                    <div className="text-center py-5">
                        <h5 className="text-muted">Tu carrito está vacío</h5>
                        <Link to='/Portal/Productos'>
                            <button className="btn btn-purple mt-3">Explorar productos</button>
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            {
                                clientData.carrito.itemsPedido.map((i, index) => (
                                    <div key={index} className="cart-item d-flex align-items-center mb-3 p-3">
                                        <img
                                            src={`http://localhost:3000${i.producto.imagen}`}
                                            alt={i.producto.nombre}
                                            className="cart-img me-3"
                                        />

                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fw-semibold">{i.producto.nombre}</h6>
                                            <span className="text-muted small">
                                                {i.producto.precio}€
                                            </span>

                                            <div className="quantity-control mt-2">
                                                <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => updateOnCart({ item: i, quantity: i.quantity === 1 ? i.quantity : i.quantity - 1 })} style={{ width: "32px", height: "32px" }}>−</button>
                                                <span className="fw-semibold" style={{ minWidth: "20px", textAlign: "center" }}>
                                                    {i.quantity}
                                                </span>
                                                <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => updateOnCart({ item: i, quantity: i.quantity + 1 })} style={{ width: "32px", height: "32px" }}>+</button>
                                            </div>
                                        </div>

                                        <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => { deleteOnCart({ item: i }) }}>
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
                                    <span>{clientData.carrito.subtotal}€</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Envío</span>
                                    <span>{clientData.carrito.gastosEnvio} €</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between fw-bold mb-3">
                                    <span>Total</span>
                                    <span>{clientData.carrito.subtotal + clientData.carrito.gastosEnvio} €</span>
                                </div>

                                <Link to='/Portal/Pedido/DetallesEncargo'>
                                    <button className="btn btn-purple w-100">Finalizar compra</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default CarritoCuenta;
