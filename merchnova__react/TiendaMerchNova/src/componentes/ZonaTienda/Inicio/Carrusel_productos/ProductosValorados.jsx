import './ProductosValorados.css'
import { Link } from "react-router";

function ProductosValorados({ products }) {
    return (
        <div id="topProductsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {/* SLIDE 1 */}
                <div className="carousel-item active">
                    <div className="row g-4">
                        {products.data.slice(0, 4).map((product, index) =>
                                <div className="col-md-3" key={index}>
                                    <div className="card product-card">
                                        <img src={product.imagen} alt={product.nombre} className="card-img-top p-3"/>

                                        <div className="card-body text-center">
                                            <h5 className="">{product.nombre.length > 24 ? product.nombre.slice(0, 20) + ' ...': product.nombre}</h5>
                                            <p className="fs-5 fw-medium text-paragraph">{product.precio} €</p>

                                            <Link to={`/Portal/Producto/${product.categoria}/${product.slug}`}>
                                                <button className="btn btn-products">Ver Detalles</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>


                {/* SLIDE 2 */}
                <div className="carousel-item">
                    <div className="row g-4">
                        {products.data.slice(4, 8).map((product, index) =>
                            <div className="col-md-3" key={index}>
                                <div className="card product-card">
                                    <img src={product.imagen} alt={product.nombre} className="card-img-top p-2" />

                                    <div className="card-body text-center">
                                        <h5 className="">{product.nombre}</h5>
                                        <p className="fs-5 fw-medium text-paragraph">{product.precio} €</p>
                                        <Link to={`/Portal/Producto/${product.categoria}/${product.slug}`}>
                                            <button className="btn btn-products">Ver Detalles</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTONES PARA CAMBIAR */}
            <span className="carousel-control-prev custom-carousel-btn">
                <button type="button" data-bs-target="#topProductsCarousel" data-bs-slide="prev" className="carousel-control-prev-icon"></button>
            </span>

            <span className="carousel-control-next custom-carousel-btn">
                <button className="carousel-control-next-icon" type="button" data-bs-target="#topProductsCarousel" data-bs-slide="prev"></button>
            </span>
        </div>
    )
}

export default ProductosValorados;
