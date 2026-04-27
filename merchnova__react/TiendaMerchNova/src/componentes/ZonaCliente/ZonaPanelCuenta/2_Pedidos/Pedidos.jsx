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
                                    <strong>{pedido.fechaPago}</strong>
                                </div>

                                <div>
                                    <span className="label">Total</span>
                                    <strong>{pedido.total}</strong>
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
                                            <img src={`http://localhost:3000${item.producto.imagen}`} alt="" />

                                            <div className="item-info">
                                                <p className="item-name">{item.producto.nombre}</p>
                                                <span className="item-qty">Cantidad: {item.quantity}</span>
                                            </div>

                                            <div className="item-price">{item.producto.precio}</div>
                                        </div>
                                    )
                                }
                            </div>

                            {/* FOOTER */}
                            <div className="order-footer">
                                <button className="btn btn-outline-purple">Ver detalles</button>
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