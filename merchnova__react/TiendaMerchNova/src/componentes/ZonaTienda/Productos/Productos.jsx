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
    const [valoration, setValoration] = useState('');
    const [params, setParams] = useSearchParams();
    const [errorPrice, setErrorPrice] = useState('');

    const page = parseInt(params.get('page')) || 1;
    const categories = params.get('categoria') || "todos";
    const minPrice = params.get('minPrice') || 0;
    const maxPrice = params.get('maxPrice') || 0;
    const valoracion = params.get('valoracion') || null;

    useEffect(
        () => {
            const getProductsByPage = async () => {
                const response = await request_filter_products.get_products_filter(categories, page, minPrice, maxPrice, valoration);
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
        }, [page, categories, maxPrice, minPrice, valoracion]
    );

    const handleSetPage = (nuevaPagina) => {
        // Esto actualiza la URL: /productos?page=2&categories=tazas
        if (nuevaPagina === page) return; // Si la página es la misma, no hacemos nada
        params.set('page', nuevaPagina);
        setParams(params);
    };



    const handleFilter = (nuevaCategoria, minPrice, maxPrice, valoracion) => {
        // Si ambos precios están vacíos, eliminar los parámetros de precio de la URL porque se quedan colgando vacios
        if (!minPrice && !maxPrice) {
            params.delete('minPrice');
            params.delete('maxPrice');
        } else {
            // Validar que el precio minimo no sea mayor que el maximo
            if (minPrice > maxPrice && minPrice !== 0 && maxPrice !== 0) {
                setErrorPrice('El precio mínimo no puede ser mayor que el de máximo');
                return;
            }

            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);
        }

        console.log('Valoracion cl: ', valoracion)
        if (!valoracion || valoracion === 'nan') {
            params.delete('valoracion')
        } else {
            params.set('valoracion', valoracion)
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
                                ["Todos", "Camisetas", "Sudaderas", "Tazas", "Llaveros", "Peluches", "Posters"].map((element, index) =>
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
                                ["Ninguno", "1 a 2 estrellas", "2 a 3 estrellas", "3 hasta 4 estrellas", "De 4 o más estrellas"].map((element, index) =>
                                    <div className="form-check" key={index}>
                                        <input className="form-check-input" id={element === 'Ninguno' ? 'nan' : `${(index)}`} type="radio" name="rating" onChange={(ev) => setValoration(ev.target.id !== null ? ev.target.id : null)} />
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

                            <button className="btn btn-filter w-100 mt-2 fw-medium" onClick={() => handleFilter((typeProduct === null ? "todos" : typeProduct), priceFilter.minPrice, priceFilter.maxPrice, valoration)} >Aplicar</button>
                        </div>
                    </div>
                </div>

                {/* PRODUCTOS A MOSTRAR */}
                <div className="col-lg-9">
                    <div className="row">
                        {dataProducts.products.length !== 0 ?
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
                                                <img src={product.imagen} className="card-img-top p-2" />
                                                <div className="card-body">
                                                    <h6 className="title-product">{product.nombre.length > 24 ? product.nombre.slice(0, 20) + ' ...' : product.nombre}</h6>
                                                    <div className="rating">
                                                        {handleValorations(product.valoraciones)} {product.valoraciones}
                                                    </div>

                                                    <p className="price">{product.precio} €</p>
                                                    <button className="btn btn-products fw-medium w-100">Ver detalles</button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                {/* Paginacion de los productos */}
                                <div className="shop-pagination-wrapper mb-4">
                                    <div className="pagination-results">{Math.min(page * dataProducts?.limit, dataProducts?.totalProducts) || 0} de {dataProducts?.totalProducts || 0} productos</div>
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
                            <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: '430px' }}>
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
