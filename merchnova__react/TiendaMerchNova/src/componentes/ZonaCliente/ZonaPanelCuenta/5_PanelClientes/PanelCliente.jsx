import { useEffect, useState } from 'react';
import './PanelCliente.css'
import { request_clients } from '../../../Servicios/peticiones_auth_frontend/request_clients';
import DetallesPedido from './Pedidos_admin/DetallesPedido';

function PanelClientes() {

    const [clients, setClients] = useState([]);
    const [order, setOrder] = useState();
    const [showOrderCompleted, setShowOrderCompleted] = useState(false);

    useEffect(
        () => {
            const get_clients = async () => {
                const clientsResponse = await request_clients.get_clients_with_orders();
                //console.log(clientsResponse.data.users);
                setClients(clientsResponse.data.users);
            }

            get_clients();
        }, []
    )

    const getTotalCompletedOrders = () => {
        const totalOrders = clients.reduce((total, client) => total + client.pedidos.filter(p => p.estado === 'COMPLETED').length, 0);
        return totalOrders;
    };

    const getTotalPendingOrders = () => {
        const totalOrders = clients.reduce((total, client) => total + client.pedidos.filter(p => p.estado === 'EN_CURSO').length, 0);
        return totalOrders;
    };


    return (
        <div className="admin-orders-wrapper">
            <div className="orders-panel">
                <div className="orders-header">
                    <h3>Gestión de pedidos</h3>
                    <span className="orders-badge">Panel administrador</span>
                </div>

                {/* TABS */}
                <div className="orders-tabs">
                    <button className={showOrderCompleted ? "tab-btn active" : "tab-btn"} onClick={() => setShowOrderCompleted(true)} >En curso<span className="tab-counter" >{getTotalPendingOrders()}</span></button>
                    <button className={!showOrderCompleted ? "tab-btn active" : "tab-btn"} onClick={() => setShowOrderCompleted(false)} >Finalizados<span className="tab-counter" >{getTotalCompletedOrders()}</span></button>
                </div>

                {/* LISTADO PEDIDOS */}
                <div className="orders-list">
                    {/* Pedidos */}
                    {(clients.length > 0 ?
                        clients.map((client, pos) =>
                            client.pedidos.map((pedido, pos) =>
                                (!showOrderCompleted ? pedido.estado === 'COMPLETED' : pedido.estado === 'EN_CURSO') &&
                                <div className="admin-order-card completed-card" key={pos} >
                                    <div className="order-top">
                                        <div>
                                            <p className="order-id">ID del Pedido: {pedido._id} </p>

                                            <span className="order-date">{pedido.fechaPago != null ? pedido.fechaPago : 'Pendiente de pago'}</span>
                                        </div>
                                        <div className='d-flex justify-conter-around align-items-center'>
                                            <span className='small me-1'>Fecha de pago</span>
                                            <span className={!showOrderCompleted ? 'status-pill completed' : 'status-pill pending'}>{pedido.fechaEnvio != null ? pedido.fechaEnvio : 'PENDIENTE'}</span>
                                        </div>
                                    </div>

                                    <div className="customer-box">
                                        <strong className='text-decoration-underline'>Cliente</strong>
                                        <span><strong className='text-name'>Nombre:</strong> {client.nombreCompleto}</span>
                                        <span><strong className='text-name'>Email:</strong> {client.cuenta.email}</span>
                                    </div>

                                    <div className="order-summary">
                                        <div>
                                            <small>Productos</small>
                                            <strong>{pedido.items.length}</strong>
                                        </div>

                                        <div>
                                            <small>Total</small>
                                            <strong>{pedido.total} €</strong>
                                        </div>

                                        <div>
                                            <small>Pago</small>
                                            <strong>{pedido.metodoPago.tipo}</strong>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button className="btn btn-outline-purple" onClick={() => setOrder(pedido)} data-bs-toggle="modal" data-bs-target='#orderDetails' >Ver detalles</button>
                                        {showOrderCompleted && <button className="btn btn-purple">Actualizar estado</button>}
                                    </div>
                                </div>
                            )
                        )
                        :
                        <div className="empty-orders">
                            <div className="empty-orders-icon">📦</div>
                            <h4>No hay pedidos para mostrar</h4>
                            <p>Actualmente no hay pedidos en esta sección.</p>
                            <button className="btn btn-outline-purple">Actualizar listado</button>
                        </div>
                    )}

                    <div className="modal" id='orderDetails' tabIndex="-1" aria-hidden="true">

                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content order-modal">
                                {/* header */}
                                <div className="modal-header border-0 pb-2">
                                    <div>
                                        <h4 className="fw-bold mb-1">Detalle del pedido</h4>
                                        <span className="order-modal-id">Pedido #{order?._id}</span>
                                    </div>

                                    <button className="btn-close" data-bs-dismiss="modal" />
                                </div>

                                {/* body */}
                                <div className="modal-body">
                                    <div className="order-products-list">
                                        {
                                            order?.items.map((item, index) => (
                                                <div className="modal-product-card" key={index}>
                                                    {/* IMAGEN */}
                                                    <div className="modal-product-image">
                                                        <img src={`http://localhost:3000${item?.producto?.imagen}`} alt={item?.producto?.nombre} />
                                                    </div>

                                                    {/* INFO */}
                                                    <div className="product-main">
                                                        <div className="product-info">
                                                            <h6>{item?.producto?.nombre}</h6>

                                                            <p>{item?.producto?.descripcion}</p>

                                                            <div className="product-extra">
                                                                <span className="product-qty">x{item?.quantity}</span>
                                                                {
                                                                    item?.producto?.talla &&
                                                                    <span className="product-size">Talla: {item?.producto?.talla}</span>
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* PRECIO */}
                                                        <div className="product-price-box">
                                                            <span className="unit-price">{item?.producto?.precio}</span>
                                                            <small>Precio unidad</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {/* TOTAL */}
                                    <div className="order-total-box">
                                        <div>
                                            <span>Total pedido</span>
                                            <p>Incluye impuestos y envío</p>
                                        </div>

                                        <strong>{order?.total}</strong>
                                    </div>
                                </div>

                                {/* footer */}
                                <div className="modal-footer border-0 justify-content-center">
                                    <button className="btn btn-purple" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PanelClientes;
