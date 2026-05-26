import { Link } from 'react-router';
import useGlobalState from '../../../../global_state/globalState';
import './Pedidos.css'

function Pedidos() {
    const { clientData } = useGlobalState();
    console.log('Cliente: ', clientData);

    return (
        <div className="orders-container">

            <h3 className="orders-title">Mis pedidos</h3>

            {/* LISTA DE PEDIDOS */}
            <div className="orders-list">

                {/* PEDIDO */}
                {clientData.pedidos.length > 0 ?
                    clientData.pedidos.map((pedido, pos) =>
                        <div className="order-card" key={pos}>
                            {/* HEADER */}
                            <div className="order-header">
                                <div>
                                    <span className="label">Pedido</span>
                                    <strong>{pedido._id}</strong>
                                </div>

                                <div>
                                    <span className="label">Fecha</span>
                                    <strong>{new Date(pedido.fechaPago).toLocaleString()}</strong>
                                </div>

                                <div>
                                    <span className="label">Total</span>
                                    <strong>{pedido.total} €</strong>
                                </div>

                                <div>
                                    <span className="status completed">{pedido.estado}</span>
                                </div>
                            </div>

                            {/* PRODUCTOS */}
                            <div className="order-body">
                                {
                                    pedido.items.map((item, index) =>
                                        <div className="order-item" key={index}>
                                            <img src={item.producto.imagen} alt={item.producto.nombre} />

                                            <div className="item-info">
                                                <p className="item-name">{item.producto.nombre}</p>
                                                <span className="item-qty">Cantidad: {item.quantity}</span>
                                            </div>

                                            <div className="item-price">{item.producto.precio} €</div>
                                        </div>
                                    )
                                }
                            </div>

                            {/* FOOTER */}
                            <div className="order-footer">
                                <button className="btn btn-outline-purple" data-bs-toggle="modal" data-bs-target={`#orderDetailsModal-${pos}`}>Ver detalles</button>
                            </div>

                            <div className="modal fade" id={`orderDetailsModal-${pos}`} tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content custom-order-modal">
                                        <div className="modal-header border-0">
                                            <div>
                                                <h5 className="modal-title">Detalles del pedido</h5>

                                                <span className="modal-order-id">#{pedido._id}</span>
                                                <div className='small'><strong className='text-black small'>Método de pago:</strong> {pedido.metodoPago.tipo}</div>
                                            </div>

                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="modal-order-info">
                                                <div className="info-card">
                                                    <span>Estado</span>
                                                    <strong>{pedido.estado}</strong>
                                                </div>

                                                <div className="info-card">
                                                    <span>Fecha</span>
                                                    <strong>
                                                        {new Date(pedido.fechaPago).toLocaleString()}
                                                    </strong>
                                                </div>

                                                <div className="info-card">
                                                    <span>Total</span>
                                                    <strong>{pedido.total} €</strong>
                                                </div>

                                            </div>

                                            <div className="modal-products">
                                                {
                                                    pedido.items.map((item, index) => (

                                                        <div className="modal-product-card" key={index}>
                                                            <img src={item.producto.imagen} alt={item.producto.nombre}/>

                                                            <div className="modal-product-info">
                                                                <h6>{item.producto.nombre}</h6>
                                                                <p>{item.producto.descripcion}</p>
                                                                <span>Cantidad: {item.quantity}</span>
                                                            </div>

                                                            <div className="modal-product-price">{item.producto.precio} €</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        <div className="modal-footer border-0">
                                            <button className="btn btn-purple" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    <div className="empty-user-orders">
                        <div className="empty-user-icon">
                            <i className="bi bi-bag-check"></i>
                        </div>
                        <h4>Aún no has realizado pedidos</h4>
                        <p>Cuando hagas tu primera compra aparecerá aquí el historial de tus pedidos.</p>

                        <Link to='/Portal/Productos' className="btn btn-purple">Explorar productos</Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Pedidos;