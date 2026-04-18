import { Link, useLoaderData } from 'react-router-dom';
import './Productos.css';
import { useRef, useState } from 'react';
import requestFetch from '../../Servicios/peticiones_fetch';


function Productos() {
    const products = useLoaderData();
    const [typeProduct, setTypeProduct] = useState({});
    const [priceFilter, setPriceFilter] = useState({});
    const [productsFilter, setProductsFilter] = useState(products.data);
    const [filters, setFilters] = useState({
        todos: true,
        camisetas: false,
        sudaderas: false,
        tazas: false,
        llaveros: false
    });

    const checkFilter = (name) => {
        const todos = name === 'todos';
        const camisetas = name === 'camisetas';
        const sudaderas = name === 'sudaderas';
        const tazas = name === 'tazas';
        const llaveros = name === 'llaveros';
        setFilters({ todos, camisetas, sudaderas, tazas, llaveros })
    }


    function onChangeCheckbox(ev) {
        //console.log('Evento checked que pasa: ', ev.target.checked);
        if (ev.target.checked) {
            setTypeProduct({
                ...typeProduct,
                [ev.target.name]: ev.target.value
            })
        } else {
            // Desestructuro para eliminar al instante el checkbox que dejas de seleccionar
            const { [ev.target.name]: _, ...deleteType } = typeProduct;
            console.log('Tipo: ', deleteType);
            setTypeProduct(deleteType);
        }


        // Evita que marque la casilla "todos" y las demas casillas a la vez
        if (ev.target.name === 'todos' && ev.target.checked) {
            checkFilter(ev.target.name);
        } else {
            setFilters((prev) => ({
                ...prev,
                'todos': false,
                [ev.target.name]: ev.target.checked
            }));
        }
    }

    async function handleFilter() {
        console.log('Filtrado de productos: ', JSON.stringify(typeProduct), priceFilter);
        const response = await requestFetch.requestGetProductsByFilter(typeProduct, priceFilter);
        //console.log('Respuesta: ', response);

        // Si esta marcado todos, muestra todos los productos
        const types = Object.keys(typeProduct);
        types.includes("todos") ? setProductsFilter(products.data) : setProductsFilter(response.products);
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
                        <input className="form-check-input" type="checkbox" name='todos' value='todos' onChange={onChangeCheckbox} checked={filters.todos} />
                        <label className='form-check-label ms-2'>Todos</label>
                        {
                            ["Camisetas", "Sudaderas", "Tazas", "Llaveros"].map((element, index) =>
                                <div className="form-check" key={index}>
                                    <input className="form-check-input" type="checkbox" name={element.charAt(0).toLowerCase() + element.slice(1)} value={element.charAt(0).toLowerCase() + element.slice(1)} onChange={onChangeCheckbox} checked={filters[element.toLowerCase()]} />
                                    <label className="form-check-label">{element}</label>
                                </div>
                            )
                        }
                    </div>

                    <div className="filter-box">
                        <h6>Valoración</h6>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="rating" />
                            <label className="form-check-label">{handleValorations(4.0)} De 4 o más</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="rating" />
                            <label className="form-check-label">{handleValorations(3.0)} De 3 hasta 4</label>
                        </div>

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
                        {productsFilter.map((product, index) =>
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
                        )}
                        {/* <div className="col-md-3 mb-4">
                            <div className="card product-card">
                                <img src="https://via.placeholder.com/250" className="card-img-top" />
                                <div className="card-body">
                                    <h6 className="product-title">Sudadera Gaming</h6>
                                    <div className="rating">⭐⭐⭐⭐☆</div>
                                    <p className="price">39.99€</p>
                                    <button className="btn btn-purple w-100">Añadir al carrito</button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productos;
