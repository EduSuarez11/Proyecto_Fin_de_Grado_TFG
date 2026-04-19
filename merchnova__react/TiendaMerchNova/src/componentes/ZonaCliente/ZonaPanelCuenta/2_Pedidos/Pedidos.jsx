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

                {
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
                                {/* <div className="order-item">
                                    <img src="https://via.placeholder.com/60" alt="" />

                                    <div className="item-info">
                                        <p className="item-name">Taza Jedi</p>
                                        <span className="item-qty">Cantidad: 1</span>
                                    </div>

                                    <div className="item-price">9.99€</div>
                                </div> */}
                            </div>

                            {/* FOOTER */}
                            <div className="order-footer">
                                <button className="btn btn-outline-purple">Ver detalles</button>
                            </div>
                        </div>
                    )
                }
                {/* <div className="order-card">
                    <div className="order-header">
                        <div>
                            <span className="label">Pedido</span>
                            <strong>#123456</strong>
                        </div>

                        <div>
                            <span className="label">Fecha</span>
                            <strong>12/04/2026</strong>
                        </div>

                        <div>
                            <span className="label">Total</span>
                            <strong>89.99€</strong>
                        </div>

                        <div>
                            <span className="status completed">Completado</span>
                        </div>
                    </div>

                    
                    <div className="order-body">

                        <div className="order-item">
                            <img src="https://via.placeholder.com/60" alt="" />

                            <div className="item-info">
                                <p className="item-name">Camiseta Star Wars</p>
                                <span className="item-qty">Cantidad: 2</span>
                            </div>

                            <div className="item-price">39.99€</div>
                        </div>

                        <div className="order-item">
                            <img src="https://via.placeholder.com/60" alt="" />

                            <div className="item-info">
                                <p className="item-name">Taza Jedi</p>
                                <span className="item-qty">Cantidad: 1</span>
                            </div>

                            <div className="item-price">9.99€</div>
                        </div>
                    </div>

                    
                    <div className="order-footer">
                        <button className="btn btn-outline-purple">Ver detalles</button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Pedidos;