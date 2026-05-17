import './Item.css';
import useGlobalState from '../../../../global_state/globalState';
import { Link } from 'react-router-dom';
import { request_cart } from '../../../Servicios/peticiones_carrito/request_cart';

function Item() {
    const { clientData, setClientData, order, setOrder } = useGlobalState();


    async function deleteOnCart({ item }) {
        if (clientData != null) {
            const newCartAfter = await request_cart.cart_persistence({ clientData, order: item.producto, quantity: item.quantity }, '/Eliminar');
            //console.log('Producto eliminado de cart: ', newCartAfter);
            setClientData(newCartAfter.data);
        } else {
            setOrder('deleteToCart', { product: item.product, quantity: 0 });
        }
        //console.log('Item a eliminar: ', item.product);
    }
    const subtotal = clientData === null ? null : clientData.carrito.itemsPedido.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);

    async function updateOnCart({ item, quantity }) {
        if (clientData !== null) {
            const updateCart = await request_cart.cart_persistence({ clientData, order: item.producto, quantity }, '/Actualizar');
            console.log('Carrito actualizado: ', updateCart);
            setClientData(updateCart.data);
        } else {
            setOrder('updateToCart', { product: item.product, quantity });
        }
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: (clientData === null ? order.items.length !== 0 : clientData.carrito.itemsPedido.length) ? "2fr 1fr" : "1fr",
            gap: '30px'
        }}>
            <div className="cart-items">
                {
                    clientData === null ?
                        (
                            order.items.length == 0 ?
                                <div className="d-flex justify-conter-center align-items-center content-empty">
                                    <div className="empty-cart-card">
                                        <h2 className="empty-cart-title">Tu carrito está vacío</h2>

                                        <p className="empty-cart-text">Parece que todavía no has añadido ningún producto.</p>

                                        <Link to='/Portal/Productos?page=1&categoria=todos' className="empty-cart-btn">Ver productos</Link>
                                    </div>
                                </div>
                                :
                                <div className="d-flex flex-column gap-3 justify-conter-center align-items-center">
                                    {
                                        order.items.map((item, index) =>
                                            <div className='cart-item w-100' key={index}>
                                                <img src={`http://localhost:3000${item.product.imagen}`} alt="producto" />

                                                <div className="item-info">
                                                    <h3 className='text-title fw-bold'>{item.product.nombre}</h3>
                                                    {item.producto.talla.length !== 0 && <p>Talla: {item.product.talla} </p>}
                                                    <p className="item-price">{item.product.precio} €</p>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => updateOnCart({ item, quantity: item.quantity - 1 })} style={{ width: "32px", height: "32px" }}>−</button>
                                                    <span className="fw-semibold" style={{ minWidth: "20px", textAlign: "center" }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => updateOnCart({ item, quantity: item.quantity + 1 })} style={{ width: "32px", height: "32px" }}>+</button>
                                                </div>

                                                <div className="item-total">{item.product.precio}</div>

                                                <button className="remove-item" onClick={() => deleteOnCart({ item })}>✕</button>
                                            </div>
                                        )
                                    }
                                </div>
                        )
                        :
                        (
                            clientData.carrito.itemsPedido.length != 0 ?
                                clientData.carrito.itemsPedido.map((item, index) =>
                                    <div className='cart-item w-100' key={index}>
                                        <img src={`http://localhost:3000${item.producto.imagen}`} alt="producto" />

                                        <div className="item-info">
                                            <h3 className='text-title fw-bold'>{item.producto.nombre}</h3>
                                            {item.producto.talla.length !== 0 && <p><strong>Talla: </strong>{item.producto.talla.join(', ')}</p>}
                                            <p className="item-price">{item.producto.precio}</p>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => updateOnCart({ item, quantity: item.quantity === 1 ? item.quantity : item.quantity - 1 })} style={{ width: "32px", height: "32px" }}>−</button>
                                            <span className="fw-semibold" style={{ minWidth: "20px", textAlign: "center" }}>
                                                {item.quantity}
                                            </span>
                                            <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" onClick={() => updateOnCart({ item, quantity: item.quantity + 1 })} style={{ width: "32px", height: "32px" }}>+</button>
                                        </div>

                                        <div className="item-total">{((item.producto.precio - (item.producto.precio * item.producto.rebaja / 100)) * item.quantity).toFixed(2)} €</div>

                                        <button className="remove-item" onClick={() => deleteOnCart({ item })}>✕</button>
                                    </div>
                                )
                                :
                                <div className="d-flex justify-conter-center align-items-center content-empty w-100">
                                    <div className="empty-cart-card">
                                        <h2 className="empty-cart-title">Tu carrito está vacío</h2>

                                        <p className="empty-cart-text">Parece que todavía no has añadido ningún producto.</p>

                                        <Link to='/Portal/Productos?page=1&categoria=todos' className="empty-cart-btn">Ver productos</Link>
                                    </div>
                                </div>
                        )
                }
            </div>

            {
                clientData === null ?
                    (
                        order.items.length != 0 &&
                        <div className="cart-summary">
                            <h2>Resumen</h2>

                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>{order.subtotal} €</span>
                            </div>

                            <div className="summary-line">
                                <span>Envío</span>
                                <span>{order.gastosEnvio}</span>
                            </div>

                            <hr />

                            <div className="summary-total">
                                <span>Total</span>
                                <span>{order.subtotal + order.gastosEnvio} €</span>
                            </div>

                            <Link to='/Pedido/DetallesEncargo'>
                                <button className="checkout-btn">Finalizar compra</button>
                            </Link>
                        </div>
                    )
                    :
                    (
                        clientData.carrito.itemsPedido.length != 0 &&
                        <div className="cart-summary">
                            <h2 className='text-title fw-bold mb-3'>Resumen</h2>

                            <div className="summary-line">
                                <span>Subtotal</span>
                                {/* <span>{Math.round(subtotal * 100) / 100} €</span> */}
                                <span>{(subtotal + order.gastosEnvio).toFixed(2)} €</span>
                            </div>

                            <div className="summary-line">
                                <span>Envío</span>
                                <span>{(order.gastosEnvio).toFixed(2)} €</span>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <span>
                                    {/* {Math.round((subtotal + order.gastosEnvio) * 100) / 100} € */}
                                    {(subtotal + order.gastosEnvio).toFixed(2)} €
                                </span>
                            </div>

                            <Link to='/Portal/Pedido/DetallesEncargo'>
                                <button className="checkout-btn">Finalizar compra</button>
                            </Link>
                        </div>
                    )
            }
        </div>
    )
}

export default Item;
