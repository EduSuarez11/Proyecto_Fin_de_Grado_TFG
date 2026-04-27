import './DetallesPedido.css';

function DetallesPedido({ order, modalId }) {
    console.log('Pedido:', order);
    console.log('Idmodal: ', modalId);
if (!order) {
    return null; // O un mensaje de carga, dependiendo de tu preferencia
}
    return (
        <div className="modal" id={modalId} tabIndex="-1" aria-hidden="true">

            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content order-modal">
                    {/* header */}
                    <div className="modal-header border-0 pb-2">
                        <div>
                            <h4 className="fw-bold mb-1">Detalle del pedido</h4>
                            <span className="order-modal-id">Pedido #{order._id}</span>
                        </div>

                        <button className="btn-close" data-bs-dismiss="modal"/>
                    </div>

                    {/* body */}
                    <div className="modal-body">
                        <div className="order-products-list">
                            {order.items.map((item, index) => (
                                <div className="modal-product-card" key={index}>
                                    <div className="product-main">
                                        <div className="product-info">
                                            <h6>{item.producto.nombre}</h6>

                                            <p>{item.producto.descripcion}</p>

                                            <small>Cantidad:{item.quantity}</small>
                                        </div>

                                        <div className="product-price">{item.producto.precio}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-total-box">
                            <span>Total pedido</span>
                            <strong>{order.total}</strong>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="modal-footer border-0 justify-content-center">
                        <button className="btn btn-purple" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetallesPedido;