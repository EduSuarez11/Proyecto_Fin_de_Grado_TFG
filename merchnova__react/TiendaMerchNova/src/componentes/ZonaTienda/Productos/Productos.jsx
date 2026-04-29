import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import './Productos.css';
import { useEffect, useRef, useState } from 'react';
import { request_filter_products } from '../../Servicios/peticiones_productos/request_products';


function Productos() {
    const [typeProduct, setTypeProduct] = useState({});
    const [products, setProducts] = useState();
    const [totalPages, setTotalPages] = useState();
    const [priceFilter, setPriceFilter] = useState({});
    const [params, setParams] = useSearchParams();
    // const [filters, setFilters] = useState({
    //     todos: true,
    //     camisetas: false,
    //     sudaderas: false,
    //     tazas: false,
    //     llaveros: false
    // });

    // const checkFilter = (name) => {
    //     const todos = name === 'todos';
    //     const camisetas = name === 'camisetas';
    //     const sudaderas = name === 'sudaderas';
    //     const tazas = name === 'tazas';
    //     const llaveros = name === 'llaveros';
    //     setFilters({ todos, camisetas, sudaderas, tazas, llaveros })
    // }

    const page = parseInt(params.get('page')) || 1;
    const categories = params.get('categoria') || "todos";

    useEffect(
        () => {
            const getProductsByPage = async () => {
                const response = await request_filter_products.get_products_filter(categories, page);
                console.log('Respuesta de la peticion: ', response)
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
            }
            getProductsByPage();
        }, [page, categories]
    );

    const handleSetPage = (nuevaPagina) => {
        // Esto actualiza la URL: /productos?page=2&categories=tazas
        if (nuevaPagina === page) return; // Si la página es la misma, no hacemos nada
        params.set('page', nuevaPagina);
        setParams(params);
    };

    const applicationFilter = (nuevaCategoria) => {
        // nuevasCategorias es un array ['tazas', 'camisetas']
        // Lo convertimos a string para la URL: "tazas,camisetas"
        params.set('categoria', nuevaCategoria);
        params.set('page', 1); // Al filtrar, siempre volvemos a la pág 1
        setParams(params);
    }


    function onChangeCheckbox(ev) {
        //console.log('Value: ', ev.target.value)
        setTypeProduct({
            ...typeProduct,
            [ev.target.id]: ev.target.value
        });
        // Evita que marque la casilla "todos" y las demas casillas a la vez
        // if (ev.target.name === 'todos' && ev.target.checked) {
        //     checkFilter(ev.target.name);
        // } else {
        //     setFilters((prev) => ({
        //         ...prev,
        //         'todos': false,
        //         [ev.target.name]: ev.target.checked
        //     }));
        // }
    }

    async function handleFilter() {
        console.log('Filtrado de productos: ', JSON.stringify(typeProduct), priceFilter);
        const response = await request_filter_products.get_products_filter();
        //console.log('Respuesta: ', response);

        // Si esta marcado todos, muestra todos los productos
        // const types = Object.keys(typeProduct);
        // types.includes("todos") ? setProductsFilter(products.data) : setProductsFilter(response.products);
        //console.log('Productos filtrados: ', productsFilter);
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
                <div className="col-lg-3">
                    <h5 className="filter-title">Filtros</h5>

                    <div className="filter-box">
                        <h6>Categoría</h6>
                        {
                            ["Todos", "Camisetas", "Sudaderas", "Tazas", "Llaveros", "Peluches", "Pósteres"].map((element, index) =>
                                <div className="form-check" key={index}>
                                    <input className="form-check-input" type="radio" name="category" id={element.toLowerCase()} onChange={onChangeCheckbox} />
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
                            <input type="number" className="form-control" name='minimo' placeholder="Min €" onChange={(ev) => setPriceFilter({ ...priceFilter, [ev.target.name]: ev.target.value })} />
                            <span>-</span>
                            <input type="number" className="form-control" name='maximo' placeholder="Max €" onChange={(ev) => setPriceFilter({ ...priceFilter, [ev.target.name]: ev.target.value })} />
                        </div>

                        <button className="btn btn-purple w-100 mt-2" onClick={handleFilter} >Aplicar</button>
                    </div>
                </div>

                <div className="col-lg-9">
                    <div className="row">
                        {products !== null ?
                            <>
                                {
                                    (products?.map((product, index) =>
                                        <Link to={`/Portal/Producto/${product.categoria}/${product.slug}`} className="col-md-3 mb-4" key={index}>
                                            <div className="card product-card">
                                                {product.rebaja > 0 && (
                                                    <div className="ribbon">
                                                        -{product.rebaja}%
                                                    </div>
                                                )}
                                                <img src={`http://localhost:3000${product.imagen}`} className="card-img-top" />
                                                <div className="card-body">
                                                    <h6 className="title-product">{product.nombre}</h6>
                                                    <div className="rating">
                                                        {handleValorations(product.valoraciones)} {product.valoraciones}
                                                    </div>

                                                    <p className="price">{product.precio}</p>
                                                    <button className="btn btn-purple w-100">Ver detalles</button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                <div className="shop-pagination-wrapper">
                                    <div className="pagination-results">Mostrando 1-12 de 96 productos</div>
                                    <nav className="shop-pagination">
                                        <button className="page-nav-btn" disabled={page === 1} onClick={() => handleSetPage(page - 1)} >&lt;</button>

                                        {Array.from({ length: totalPages }).map((_, pos) =>
                                            <>
                                                <button className={pos + 1 === page ? "page-number active" : "page-number"} onClick={() => handleSetPage(pos + 1)} >{pos + 1}</button>
                                                {page + 3 === pos && <span className="pagination-dots">...</span>}
                                            </>
                                        )}
                                        <button className="page-nav-btn" disabled={page === totalPages} onClick={() => handleSetPage(page + 1)} >&gt;</button>
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
