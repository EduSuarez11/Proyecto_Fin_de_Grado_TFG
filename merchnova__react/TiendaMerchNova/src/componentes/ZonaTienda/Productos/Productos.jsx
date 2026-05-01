import { data, Link, useLoaderData, useSearchParams } from 'react-router-dom';
import './Productos.css';
import { useEffect, useRef, useState } from 'react';
import { request_filter_products } from '../../Servicios/peticiones_productos/request_products';


function Productos() {
    const [typeProduct, setTypeProduct] = useState({});
    const [dataProducts, setDataProducts] = useState({
        lengthProducts: 0,
        totalPages: 0,
        totalProducts: 0,
        products: []
    });
    const [priceFilter, setPriceFilter] = useState({
        minPrice: 0,
        maxPrice: 0
    });
    const [params, setParams] = useSearchParams();
    const [errorPrice, setErrorPrice] = useState('');

    const page = parseInt(params.get('page')) || 1;
    const categories = params.get('categoria') || "todos";
    const minPrice = params.get('minPrice') || 0;
    const maxPrice = params.get('maxPrice') || 0;

    useEffect(
        () => {
            const getProductsByPage = async () => {
                const response = await request_filter_products.get_products_filter(categories, page, minPrice, maxPrice);
                console.log('Respuesta de la peticion: ', response)
                setDataProducts({
                    ...dataProducts,
                    limit: response.data.limit,
                    totalPages: response.data.totalPages,
                    lengthProducts: response.data.summaryProducts,
                    totalProducts: response.data.total,
                    products: response.data.products
                });
            }
            getProductsByPage();
        }, [page, categories, maxPrice, minPrice]
    );

    const handleSetPage = (nuevaPagina) => {
        // Esto actualiza la URL: /productos?page=2&categories=tazas
        if (nuevaPagina === page) return; // Si la página es la misma, no hacemos nada
        params.set('page', nuevaPagina);
        setParams(params);
    };

    const handleFilter = (nuevaCategoria, minPrice, maxPrice) => {
        if (minPrice > maxPrice) {
            setErrorPrice('El precio mínimo no puede ser mayor que el de máximo');
            return;
        }

        if (minPrice || maxPrice || minPrice !== 0 || maxPrice !== 0) {
            params.set("minPrice", minPrice);
            params.set("maxPrice", maxPrice);
        }

        params.set('categoria', nuevaCategoria);
        params.set('page', 1);
        setParams(params);
    }

    // Controla las valoraciones
    function handleValorations(valoraciones) {
        const stars = [];
        const numberStars = Math.trunc(valoraciones);
        Array.from({ length: 5 }).map((_, pos) => {
            if (numberStars >= pos + 1) {
                stars.push(<span key={pos} className="star full">★</span>)
            } else if (valoraciones >= pos + 1 - 0.5) {
                stars.push(<span key={pos} className="star half">★</span>)
            } else {
                stars.push(<span key={pos} className="star empty">★</span>)
            }
        });
        return stars;
    }


    return (
        <div className="container mt-5">
            <nav className="breadcrumb">
                <Link to='/'>Inicio </Link>
                <span className="mx-2">/</span>
                <span className='current-product'>Tienda</span>
            </nav>
            <div className="row">
                <div className="col-lg-3 mb-5">
                    <div className='filter-sticky'>
                        {/* FILTROS */}
                        <h5 className="filter-title">Filtros</h5>

                        <div className="filter-box">
                            <h6>Categoría</h6>
                            {
                                ["Todos", "Camisetas", "Sudaderas", "Tazas", "Llaveros", "Peluches", "Pósteres"].map((element, index) =>
                                    <div className="form-check" key={index}>
                                        <input className="form-check-input" type="radio" name="category" id={element.toLowerCase()} onChange={(ev) => setTypeProduct(ev.target.id !== null ? ev.target.id : null)} />
                                        <label className="form-check-label">{element}</label>
                                    </div>
                                )
                            }
                        </div>

                        <div className="filter-box">
                            <h6>Valoración</h6>
                            {
                                ["De 4 o más", "De 3 hasta 4"].map((element, index) =>
                                    <div className="form-check" key={index}>
                                        <input className="form-check-input" type="radio" name="rating" />
                                        <label className="form-check-label">{element}</label>
                                    </div>
                                )
                            }
                        </div>

                        <div className="filter-box">
                            <h6>Precio</h6>
                            <div className="price-inputs">
                                <input type="number" className="form-control" name='minPrice' id='minPrice' placeholder="Min €" onChange={(ev) => setPriceFilter({ ...priceFilter, [ev.target.id]: ev.target.value })} />
                                <span>-</span>
                                <input type="number" className="form-control" name='maxPrice' id='maxPrice' placeholder="Max €" onChange={(ev) => setPriceFilter({ ...priceFilter, [ev.target.id]: ev.target.value })} />
                            </div>

                            {errorPrice !== '' && <span className='text-danger'>{errorPrice}</span>}

                            <button className="btn btn-filter w-100 mt-2 fw-medium" onClick={() => handleFilter((typeProduct === null ? "todos" : typeProduct), priceFilter.minPrice, priceFilter.maxPrice)} >Aplicar</button>
                        </div>
                    </div>
                </div>

                {/* PRODUCTOS A MOSTRAR */}
                <div className="col-lg-9">
                    <div className="row">
                        {dataProducts.products  ?
                            <>
                                {
                                    (dataProducts.products?.map((product, index) =>
                                        <Link to={`/Portal/Producto/${product.categoria}/${product.slug}`} className="col-md-3 mb-4" key={index}>
                                            <div className="card product-card">
                                                {product.rebaja > 0 && (
                                                    <div className="ribbon">
                                                        -{product.rebaja}%
                                                    </div>
                                                )}
                                                <img src={`http://localhost:3000${product.imagen}`} className="card-img-top p-2" />
                                                <div className="card-body">
                                                    <h6 className="title-product">{product.nombre}</h6>
                                                    <div className="rating">
                                                        {handleValorations(product.valoraciones)} {product.valoraciones}
                                                    </div>

                                                    <p className="price">{product.precio}</p>
                                                    <button className="btn btn-products fw-medium w-100">Ver detalles</button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                <div className="shop-pagination-wrapper mb-4">
                                    <div className="pagination-results">{Math.min(page * dataProducts?.limit, dataProducts?.totalProducts)} de {dataProducts?.totalProducts} productos</div>
                                    <nav className="shop-pagination">
                                        <button className="page-nav-btn" disabled={page === 1} onClick={() => handleSetPage(page - 1)} >&lt;</button>

                                        {Array.from({ length: dataProducts.totalPages }).map((_, pos) =>
                                            <>
                                                <button className={pos + 1 === page ? "page-number active" : "page-number"} onClick={() => handleSetPage(pos + 1)} >{pos + 1}</button>
                                                {page + 3 === pos && <span className="pagination-dots">...</span>}
                                            </>
                                        )}
                                        <button className="page-nav-btn" disabled={page === dataProducts.totalPages} onClick={() => handleSetPage(page + 1)} >&gt;</button>
                                    </nav>
                                </div>
                            </>
                            :
                            <div className="d-flex justify-content-center align-items-center flex-column">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                <span>Cargando</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productos;
