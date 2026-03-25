import { Link, useLoaderData } from 'react-router-dom';
import './Productos.css';


function Productos() {
    const products = useLoaderData();

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
                            ["Camisetas", "Sudaderas", "Tazas", "Llaveros"].map((element, index) =>
                                <div className="form-check" key={index}>
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label">{element}</label>
                                </div>
                            )
                        }
                    </div>

                    <div className="filter-box">
                        <h6>Talla</h6>
                        {
                            ["S", "M", "L", "XL", "XXL"].map((element, index) =>
                                <div className="form-check" key={index}>
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label">{element}</label>
                                </div>
                            )
                        }
                    </div>

                    <div className="filter-box">
                        <h6>Valoración</h6>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="rating" />
                            <label className="form-check-label">⭐ 4 o más</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="rating" />
                            <label className="form-check-label">⭐ 3 o más</label>
                        </div>

                    </div>

                    <div className="filter-box">
                        <h6>Precio</h6>
                        <div className="price-inputs">
                            <input type="number" className="form-control" placeholder="Min €" />
                            <span>-</span>
                            <input type="number" className="form-control" placeholder="Max €" />
                        </div>

                        <button className="btn btn-purple w-100 mt-2">Aplicar</button>
                    </div>
                </div>

                <div className="col-lg-9">
                    <div className="row">
                        {products.data.map((product, index) =>
                            <Link to={`/Producto/${product.categoria}/${product.slug}`} className="col-md-3 mb-4" key={index}>
                                <div className="card product-card">
                                    <img src={`http://localhost:3000${product.imagen}`} className="card-img-top" />
                                    <div className="card-body">
                                        <h6 className="title-product">{product.nombre}</h6>
                                        <div className="rating">
                                            ⭐⭐⭐⭐☆
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
