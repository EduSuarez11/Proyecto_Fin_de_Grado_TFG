import { Link, useLoaderData } from 'react-router-dom';
//import useGlobalState from '../../../../global_state/globalState';
import './InfoProducto.css';
import useGlobalState from '../../../../global_state/globalState';
import { useState } from 'react';

function InfoProducto() {

    const resp = useLoaderData();
    const { setOrder } = useGlobalState();
    const [quantity, setQuantity] = useState(0);
    //console.log('Producto escogido: ', resp.product);

    function handleAddToCart() {
        console.log('Producto al añadir: ', resp.product);
        console.log('Cantidad total add: ', quantity);
        setOrder('addToCart', { product: resp, quantity: quantity });
    }

    function onChangeQty(ev) {
        setQuantity(parseInt(ev.target.value))
    }

    return (
        <div className="product-page bg-light">
            <nav className="breadcrumb">
                <Link to='/'>Inicio </Link>
                <span className="mx-2">/</span>
                <Link to='/Productos'>Tienda</Link>
                <span className="mx-2">/</span>
                <span className="current-product">{resp.product.nombre}</span>
            </nav>
            <div className="product-container">
                <div className="product-image">
                    <img src={`http://localhost:3000${resp.product.imagen}`} alt="producto" />
                </div>

                {/* Nombre producto */}
                <div className="product-info">
                    <h1 className="product-title">
                        {resp.product.nombre}
                    </h1>

                    <p className="product-description">
                        {resp.product.descripcion}
                    </p>

                    <div className="product-price">
                        {resp.product.precio}€
                    </div>

                    {/* Tallas */}
                    <div className="product-sizes">
                        <p>Tallas disponibles</p>

                        <div className="sizes">
                            <button className="size-btn">S</button>
                            <button className="size-btn">M</button>
                            <button className="size-btn">L</button>
                            <button className="size-btn">XL</button>
                        </div>
                    </div>

                    {/* Cantidad */}
                    <div className="product-quantity">
                        <p>Cantidad</p>
                        <input
                            type="number"
                            min="1"
                            max='10'
                            defaultValue="1"
                            id='quantity'
                            className="quantity-input"
                            onChange={onChangeQty}
                        />
                    </div>

                    {/* Botones */}
                    <div className="product-actions">
                        <button className="btn-cart" onClick={handleAddToCart}>Añadir al carrito</button>

                        <button className="btn-buy">
                            Comprar ahora
                        </button>
                    </div>
                </div>
            </div>

            <div className="related-products">
                <h2>Otros productos</h2>

                <div className="related-grid">
                    <div className="related-card">
                        <img src="/images/product1.jpg" alt="producto" />
                        <h3>Camiseta 1</h3>
                        <p>29.99€</p>
                    </div>

                    <div className="related-card">
                        <img src="/images/product2.jpg" alt="producto" />
                        <h3>Camiseta 2</h3>
                        <p>29.99€</p>
                    </div>

                    <div className="related-card">
                        <img src="/images/product3.jpg" alt="producto" />
                        <h3>Camiseta 3</h3>
                        <p>29.99€</p>
                    </div>

                    <div className="related-card">
                        <img src="/images/product4.jpg" alt="producto" />
                        <h3>Camiseta 4</h3>
                        <p>29.99€</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoProducto;
