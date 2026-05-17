import './InfoProducto.css';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import useGlobalState from '../../../../global_state/globalState';
import { startTransition, useEffect, useState } from 'react';
import MensajeSuccess from '../../../global_components/MensajeComponent/MensajeSuccess';
import { request_cart } from '../../../Servicios/peticiones_carrito/request_cart';

function InfoProducto() {

    const resp = useLoaderData();
    const navigate = useNavigate();
    const { order, setOrder, clientData, setClientData } = useGlobalState();
    const [quantity, setQuantity] = useState(1);
    const [addSuccess, setAddSuccess] = useState();
    const [talla, setTalla] = useState('');
    const [moreProducts, setMoreProducts] = useState(resp.moreProducts);
    //console.log('Producto: ', resp);

    useEffect(
        () => {
            async function randomProducts() {
                const requestProducts = await fetch(`http://localhost:3000/api/products/Chosen/${resp.product.categoria}/${resp.product.slug}`)
                const response = await requestProducts.json();

                setMoreProducts(response.moreProducts);
            }
            randomProducts();
        }, [resp.product.slug]
    );

    function handleValorations() {
        const stars = [];
        const numberStars = Math.trunc(resp.product.valoraciones);
        Array.from({ length: 5 }).map((_, pos) => {
            if (numberStars >= pos + 1) {
                stars.push(<span key={pos} className="star full">★</span>)
            } else if (resp.product.valoraciones >= pos + 1 - 0.5) {
                stars.push(<span key={pos} className="star half">★</span>)
            } else {
                stars.push(<span key={pos} className="star empty">★</span>)
            }
        });
        return stars;
    }


    async function handleAddToCart() {
        //console.log('Producto al añadir: ', resp);
        //console.log('Cantidad total add: ', quantity);
        if (clientData != null) {
            const response = await request_cart.cart_persistence({ clientData, order: resp.product, quantity, gastosEnvio: order.gastosEnvio, talla: talla }, '/Agregar');

            if (response.code !== 0) throw new Error('Fallo al obtener la respuesta');

            //console.log(response.data);
            setClientData(response.data);
        } else {
            setOrder('addToCart', { product: resp.product, quantity: quantity });
        }
        setAddSuccess('Producto añadido al carrito');
    }

    function onChangeQty(ev) {
        setQuantity(parseInt(ev.target.value))
    }

    return (
        <div className="product-page bg-light">
            {
                addSuccess &&
                <MensajeSuccess msg={addSuccess} setState={setAddSuccess} />
            }
            <nav className="breadcrumb">
                <Link to='/'>Inicio </Link>
                <span className="mx-2">/</span>
                <Link to='/Portal/Productos'>Tienda</Link>
                <span className="mx-2">/</span>
                <span className="current-product">{resp.product.nombre}</span>

            </nav>
            <div className='mb-4 icon-color-d d-flex justify-content-center rounded-circle' onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i>
            </div>

            <div className="product-container">
                <div className="product-image">
                    <img src={`http://localhost:3000${resp.product.imagen}`} alt="producto" />
                </div>

                {/* Nombre producto */}
                <div className="product-info">
                    <h1 className="product-title">{resp.product.nombre}</h1>

                    <div className="mb-2 rating">
                        {handleValorations()}
                        <span className="rating-number ms-1">({resp.product.valoraciones})</span>
                    </div>

                    <div className="stock mb-2">
                        {resp.product.stock > 0 ?
                            <span className="in-stock text-success">En stock: {resp.product.stock} restantes</span>
                            :
                            <span className="out-stock text-danger">Sin stock</span>
                        }
                    </div>

                    <p className="product-description">{resp.product.descripcion}</p>

                    <div className='d-flex flex-column'>
                        {
                            resp.product.rebaja > 0 &&
                            <div className="product-price">
                                <span className="text-danger text-ofert me-2"> - {resp.product.rebaja}%</span>
                                {(resp.product.precio - (resp.product.precio * resp.product.rebaja / 100)).toFixed(2)} € <span className='small'>(Por unidad)</span>
                            </div>
                        }
                        <div className={resp.product.rebaja > 0 ? 'product-price text-decoration-line-through text-secondary opacity-price' : 'product-price mb-4'}>
                            <span className='text-black'>{resp.product.rebaja === 0 && 'Por unidad: '}</span>
                            {resp.product.precio}€
                        </div>
                    </div>


                    {/* Tallas */}
                    {
                        resp.product.talla.length > 0 &&
                        <div className="product-sizes">
                            <p>Tallas disponibles</p>
                            <div className="sizes">
                                {
                                    resp.product.talla.map((element, index) =>
                                        <div className={talla === element ? "talla-btn-active" : "size-btn"} id={element} onClick={(ev) => setTalla(element)} key={index}>{element}</div>
                                    )
                                }
                            </div>
                        </div>
                    }

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
                        <button className="btn-buy">Comprar ahora</button>
                    </div>
                </div>
            </div>

            <div className="related-products">
                <h2>Otros productos</h2>
                <div className="related-grid">
                    {
                        moreProducts?.map((product, el) =>
                            <div className="related-card" key={el}>
                                <Link to={`/Portal/Producto/${product.categoria}/${product.slug}`}>
                                    <img src={`http://localhost:3000${product.imagen}`} alt={product.nombre} />
                                    <h3>{product.nombre}</h3>
                                    <p>{product.precio}</p>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default InfoProducto;
