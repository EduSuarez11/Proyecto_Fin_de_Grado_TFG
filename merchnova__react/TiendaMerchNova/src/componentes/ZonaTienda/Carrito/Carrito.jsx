import useGlobalState from '../../../global_state/globalState';
import './Carrito.css';
import { Link } from 'react-router-dom';

function Carrito() {
    const { order, setOrder } = useGlobalState();
    console.log('Productos: ', order);

    function deleteOnCart({ item }) {
        //console.log('Item a eliminar: ', item.product);
        setOrder('deleteToCart', { product: item.product, quantity: 0 });
    }

    function updateOnCart({ item, quantity }) {
        setOrder('updateToCart', { product: item.product, quantity });
    }

    return (
        <div className="cart-page bg-light">
            <div className="cart-container">
                <nav className="breadcrumb">
                    <Link to='/'>Inicio </Link>
                    <span className="mx-2">/</span>
                    <span className='current-product'>Carrito</span>
                </nav>
                <h1 className="cart-title">Tu carrito</h1>
                <div className="mb-3"><span>Tienes {order.items.length} elementos</span></div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: order.items.length !== 0 ? "2fr 1fr" : "1fr",
                    gap: '30px'
                }}>
                    <div className="cart-items">
                        {
                            order.items.length == 0 ?
                                <div className="d-flex justify-conter-center align-items-center content-empty">
                                    <div className="empty-cart-card">
                                        <h2 className="empty-cart-title">Tu carrito está vacío</h2>

                                        <p className="empty-cart-text">Parece que todavía no has añadido ningún producto.</p>

                                        <Link to='/Productos' className="empty-cart-btn">Ver productos</Link>
                                    </div>
                                </div>
                                :
                                <div className="d-flex flex-column gap-3 justify-conter-center align-items-center">
                                    {order.items.map((item, index) =>
                                        <div className='cart-item w-100' key={index}>
                                            <img src={`http://localhost:3000${item.product.imagen}`} alt="producto" />

                                            <div className="item-info">
                                                <h3>{item.product.nombre}</h3>
                                                <p>Talla: M</p>
                                                <p className="item-price">{item.product.precio}</p>
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
                                    )}
                                </div>
                        }
                    </div>
                    {
                        order.items.length != 0 &&
                        <div className="cart-summary">
                            <h2>Resumen</h2>

                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>{order.subtotal} €</span>
                            </div>

                            <div className="summary-line">
                                <span>Envío</span>
                                <span>1,03 €</span>
                            </div>

                            <hr />

                            <div className="summary-total">
                                <span>Total</span>
                                <span>{order.subtotal + 1.03} €</span>
                            </div>

                            <Link to='/Pedido/DetallesEncargo'>
                                <button className="checkout-btn">
                                    Finalizar compra
                                </button>
                            </Link>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

export default Carrito;
