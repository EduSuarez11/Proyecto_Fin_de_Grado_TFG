import { Link, useLoaderData, useLocation } from 'react-router-dom';
import './Home.css';
import { useState } from 'react';
import MensajeSuccess from '../../global_components/MensajeComponent/MensajeSuccess';


function Home() {
    const location = useLocation();
    const [loginSuccess, setLoginSuccess] = useState(location.state?.msg);
    const products = useLoaderData();
    
    /** #region  ----------------- Objeto products -------------------------
        {
            code: 0/1,
            message: '...',
            data: {
                "nombre": "...",
                "descripcion": "...",
                "precio": 0,
                "rebaja": 0,
                "imagen": "...",
                "categoria": "...",
                "talla": [],
                "stock": 0,
                "valoraciones": [4.8],
                "mediaValoracion": 0,
                "slug": "...",
                "path": "0",
                "createdAt": "2026-03-20"
            }
        }
     #endregion */
    //console.log('Productos en Home: ', products);
    return (
        <>
            <div className="hero text-center text-white d-flex align-items-center">
                {
                    loginSuccess &&
                    <MensajeSuccess msg={loginSuccess} setAdd={setLoginSuccess} />
                }
                <div className="container">
                    <h1 className="display-4 fw-bold">
                        Crea tu Merch Personalizado
                    </h1>

                    <p className="lead">
                        Diseña camisetas, tazas y accesorios únicos
                    </p>

                    <Link to='/Productos'>
                        <button className="btn btn-light btn-lg mt-3">
                            Explorar productos
                        </button>
                    </Link>
                </div>
            </div>

            <div className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="mb-5">Categorías</h2>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="category-card p-4">
                                <h1>👕</h1>
                                <p>Ropa</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="category-card p-4">
                                <h1>☕</h1>
                                <p>Tazas</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="category-card p-4">
                                <h1>🎒</h1>
                                <p>Accesorios</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Productos destacados</h2>
                    <div className="row g-4">
                        {products.data.map((product, index) =>
                            <div className="col-md-3" key={index}>
                                <div className="card product-card">
                                    <img src={`http://localhost:3000${product.imagen}`} alt={product.nombre} className="card-img-top" />

                                    <div className="card-body text-center">
                                        <h5 className="card-title">{product.nombre}</h5>
                                        <p>{product.precio}</p>
                                        <Link to='/Productos'>
                                            <button className="btn btn-purple">
                                                Ver Detalles
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <div className="row g-4">
                        <div className="col-md-3">
                            <div className="card product-card">
                                <img src='miimagen.png' className="card-img-top"/>

                                <div className="card-body text-center">
                                    <h5 className="card-title">Camiseta personalizada</h5>
                                    <p>14.99€</p>
                                    <button className="btn btn-purple">
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="promo text-center text-white py-5">

                <div className="container">

                    <h2>🔥 20% de descuento en camisetas</h2>

                    <button className="btn btn-light mt-3">
                        Comprar ahora
                    </button>

                </div>
            </div>

        </>
    );
}

export default Home;
