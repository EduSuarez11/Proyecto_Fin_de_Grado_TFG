import useGlobalState from '../../../global_state/globalState';
import './Carrito.css';
import { Link } from 'react-router-dom';

function Carrito() {
    const { order } = useGlobalState();
    console.log('Productos: ', order);
    return (
        <div className="cart-page bg-light">
            <div className="cart-container">
                <h1 className="cart-title">Tu carrito</h1>
                <div className="cart-content">
                    <div className="cart-items">
                        {
                            order.items.length === 0 ?
                                <div className="d-flex justify-conter-center align-items-center content-empty">
                                    <div className="empty-cart-card">
                                        <h2 className="empty-cart-title">Tu carrito está vacío</h2>

                                        <p className="empty-cart-text">Parece que todavía no has añadido ningún producto.</p>

                                        <Link to='/Productos' className="empty-cart-btn">Ver productos</Link>
                                    </div>
                                </div>
                                :
                                <div className="cart-item">
                                    <img src="/images/product1.jpg" alt="producto" />

                                    <div className="item-info">
                                        <h3>Camiseta 1</h3>
                                        <p>Talla: M</p>
                                        <p className="item-price">29.99€</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button>-</button>
                                        <span>1</span>
                                        <button>+</button>
                                    </div>

                                    <div className="item-total">
                                        29.99€
                                    </div>

                                    <button className="remove-item">
                                        ✕
                                    </button>

                                    <img src="/images/product2.jpg" alt="producto" />

                                    <div className="item-info">
                                        <h3>Camiseta 2</h3>
                                        <p>Talla: L</p>
                                        <p className="item-price">34.99€</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button>-</button>
                                        <span>2</span>
                                        <button>+</button>
                                    </div>

                                    <div className="item-total">
                                        69.98€
                                    </div>

                                    <button className="remove-item">
                                        ✕
                                    </button>
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
