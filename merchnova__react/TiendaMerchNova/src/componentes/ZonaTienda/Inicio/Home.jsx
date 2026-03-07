import './Home.css';

function Home() {

    return (
        <div>
            <div class="hero text-center text-white d-flex align-items-center">
                <div class="container">
                    <h1 class="display-4 fw-bold">
                        Crea tu Merch Personalizado
                    </h1>

                    <p class="lead">
                        Diseña camisetas, tazas y accesorios únicos
                    </p>

                    <button class="btn btn-light btn-lg mt-3">
                        Explorar productos
                    </button>
                </div>
            </div>

            <div class="py-5 bg-light text-center">
                <div class="container">
                    <h2 class="mb-5">Categorías</h2>

                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="category-card p-4">
                                <h1>👕</h1>
                                <p>Ropa</p>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="category-card p-4">
                                <h1>☕</h1>
                                <p>Tazas</p>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="category-card p-4">
                                <h1>🎒</h1>
                                <p>Accesorios</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-5">
                <div class="container">
                    <h2 class="text-center mb-5">Productos destacados</h2>

                    <div class="row g-4">
                        <div class="col-md-3">
                            <div class="card product-card">
                                <img src="https://via.placeholder.com/300" class="card-img-top"/>

                                    <div class="card-body text-center">

                                        <h5 class="card-title">Camiseta personalizada</h5>

                                        <p>19.99€</p>

                                        <button class="btn btn-purple">
                                            Añadir al carrito
                                        </button>
                                    </div>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="card product-card">
                                <img src="https://via.placeholder.com/300" class="card-img-top"/>

                                    <div class="card-body text-center">

                                        <h5 class="card-title">Taza personalizada</h5>

                                        <p>14.99€</p>

                                        <button class="btn btn-purple">
                                            Añadir al carrito
                                        </button>
                                    </div>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="card product-card">
                                <img src="https://via.placeholder.com/300" class="card-img-top"/>

                                    <div class="card-body text-center">
                                        <h5 class="card-title">Sudadera personalizada</h5>

                                        <p>29.99€</p>

                                        <button class="btn btn-purple">
                                            Añadir al carrito
                                        </button>
                                    </div>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="card product-card">
                                <img src="https://via.placeholder.com/300" class="card-img-top"/>

                                    <div class="card-body text-center">

                                        <h5 class="card-title">Totebag personalizada</h5>

                                        <p>12.99€</p>

                                        <button class="btn btn-purple">
                                            Añadir al carrito
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="promo text-center text-white py-5">

                <div class="container">

                    <h2>🔥 20% de descuento en camisetas</h2>

                    <button class="btn btn-light mt-3">
                        Comprar ahora
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Home;
