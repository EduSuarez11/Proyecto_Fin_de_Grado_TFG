import './Productos.css';

function Productos() {

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-3">

                    <h5 className="filter-title">Filtros</h5>

                    <div className="filter-box">
                        <h6>Categoría</h6>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Camisetas</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Sudaderas</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Tazas</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Llaveros</label>
                        </div>
                    </div>

                    <div className="filter-box">

                        <h6>Talla</h6>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">S</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">M</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">L</label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">XL</label>
                        </div>
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

                        <button className="btn btn-purple w-100 mt-2">
                            Aplicar
                        </button>
                    </div>
                </div>

                <div className="col-lg-9">
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <div className="card product-card">
                                <img src="https://via.placeholder.com/250" className="card-img-top" />
                                <div className="card-body">
                                    <h6 className="product-title">Camiseta Naruto</h6>
                                    <div className="rating">
                                        ⭐⭐⭐⭐☆
                                    </div>
                                    <p className="price">19.99€</p>
                                    <button className="btn btn-purple w-100">
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-4">
                            <div className="card product-card">
                                <img src="https://via.placeholder.com/250" className="card-img-top" />
                                <div className="card-body">
                                    <h6 className="product-title">Taza Anime</h6>
                                    <div className="rating">⭐⭐⭐⭐⭐</div>
                                    <p className="price">12.99€</p>
                                    <button className="btn btn-purple w-100">Añadir al carrito</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-4">
                            <div className="card product-card">
                                <img src="https://via.placeholder.com/250" className="card-img-top" />
                                <div className="card-body">
                                    <h6 className="product-title">Sudadera Gaming</h6>
                                    <div className="rating">⭐⭐⭐⭐☆</div>
                                    <p className="price">39.99€</p>
                                    <button className="btn btn-purple w-100">Añadir al carrito</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-4">
                            <div className="card product-card">
                                <img src="https://via.placeholder.com/250" className="card-img-top" />
                                <div className="card-body">
                                    <h6 className="product-title">Llavero Star</h6>
                                    <div className="rating">⭐⭐⭐⭐☆</div>
                                    <p className="price">5.99€</p>
                                    <button className="btn btn-purple w-100">Añadir al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productos;
