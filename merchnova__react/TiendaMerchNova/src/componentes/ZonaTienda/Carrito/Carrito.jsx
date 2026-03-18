import useGlobalState from '../../../global_state/globalState';
import './Carrito.css';
import { Link } from 'react-router-dom';

function Carrito() {
    const { order, setOrder } = useGlobalState();
    console.log('Productos: ', order);

    function deleteOnCart({item}) {
        console.log('Item a eliminar: ', item.product);
        setOrder('deleteToCart', { product: item.product, quantity: 0 })
    }

    return (
        <div className="cart-page bg-light">
            <div className="cart-container">
                <h1 className="cart-title">Tu carrito</h1>
                <div className="cart-content">
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
                                                <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>−</button>
                                                <span className="fw-semibold" style={{ minWidth: "20px", textAlign: "center" }}>
                                                    {item.quantity}
                                                </span>
                                                <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>+</button>
                                            </div>

                                            <div className="item-total">{item.product.precio}</div>

                                            <button className="remove-item" onClick={ () => deleteOnCart({item}) }>✕</button>
                                        </div>
                                    )}

                                </div>
                        }
                    </div>

                    <div className="cart-summary">
                        <h2>Resumen</h2>

                        <div className="summary-line">
                            <span>Subtotal</span>
                            <span>99.97€</span>
                        </div>

                        <div className="summary-line">
                            <span>Envío</span>
                            <span>Gratis</span>
                        </div>

                        <hr />

                        <div className="summary-total">
                            <span>Total</span>
                            <span>99.97€</span>
                        </div>

                        <button className="checkout-btn">
                            Finalizar compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carrito;
