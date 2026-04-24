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
            code: 0,
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
                    <MensajeSuccess msg={loginSuccess} setState={setLoginSuccess} />
                }
                <div className="container">
                    <h1 className="display-4 fw-bold">
                        Compra y vende tu Merch Personalizado
                    </h1>

                    <p className="lead">
                        Adquiere camisetas, tazas y accesorios únicos
                    </p>

                    <Link to='/Portal/Productos'>
                        <button className="btn btn-light btn-lg mt-3">Explorar productos</button>
                    </Link>
                </div>
            </div>

            <div className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="mb-5">Categorías</h2>
                    <div className="row g-4">
                        {
                            [
                                { name: "Ropa", icon: '👕' },
                                { name: "Tazas", icon: '☕' },
                                { name: "Accesorios", icon: '🎒' },
                            ].map((element, index) =>
                                <div className="col-md-4" key={index}>
                                    <div className="category-card p-4">
                                        <h1>{element.icon}</h1>
                                        <p>{element.name}</p>
                                    </div>
                                </div>
                            )
                        }
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
                                        <Link to={`/Portal/Producto/${product.categoria}/${product.slug}`}>
                                            <button className="btn btn-purple">Ver Detalles</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="promo text-center text-white py-5">
                <div className="container">
                    <h2>🔥 Descuento en todo tipo de productos</h2>
                    <Link to='/Portal/Productos'>
                        <button className='className="btn btn-light mt-3"'>Comprar ahora</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Home;
