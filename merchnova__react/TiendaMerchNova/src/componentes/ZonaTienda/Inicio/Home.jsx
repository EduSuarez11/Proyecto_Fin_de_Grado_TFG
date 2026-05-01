import { Link, useLoaderData, useLocation } from 'react-router-dom';
import './Home.css';
import { useState } from 'react';
import MensajeSuccess from '../../global_components/MensajeComponent/MensajeSuccess';
import ProductosValorados from './Carrusel_productos/ProductosValorados';


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
            <div className="hero text-center d-flex align-items-center">
                {
                    loginSuccess &&
                    <MensajeSuccess msg={loginSuccess} setState={setLoginSuccess} />
                }
                <div className="container">
                    <h1 className="display-4 fw-bold text-title">Compra y vende tu Merch Personalizado</h1>

                    <p className="lead fw-semibold text-paragraph">Adquiere camisetas, tazas y accesorios únicos</p>

                    <Link to='/Portal/Productos?page=1&categoria=todos'>
                        <button className="btn btn-products fw-semibold btn-lg mt-3">Explorar productos</button>
                    </Link>
                </div>
            </div>

            <div className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="mb-2 text-title fw-bold">Categorías</h2>
                    <p className='mb-4 mt-3 fw-semibold'>
                        Disponemos de varías categorías de productos en nuestra tienda como por ejemplo: camisetas, tazas,
                        sudaderas, peluches y otros productos. Ven y descubre las maravillas que encontrarás en nuestra tienda que
                        también hay productos que en alguna vez reciben descuentos por tiempo limitado. ¡Así que te no te pierdas las
                        mejores oportunidades!
                    </p>
                    <div className="row g-4">
                        {[
                            { name: "Ropa", icon: 'fa-solid fa-shirt' }, { name: "Tazas", icon: 'fa-solid fa-mug-saucer' }, { name: "Accesorios", icon: 'fa-solid fa-plus' },
                        ].map((element, index) =>
                            <div className="col-md-4" key={index}>
                                <div className="category-card p-4">
                                    <h1 className='mb-3'><i className={element.icon}></i></h1>
                                    <p className='text-paragraph fw-medium'>{element.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="py-5">
                <div className="container">
                    <h2 className="text-center mb-3 fw-bold text-title">Productos destacados</h2>
                    <p className="mb-4 text-paragraph text-center fw-medium">Aquí puedes encontrar los productos más destacados en la tienda.</p>

                    <ProductosValorados products={products}/>
                    
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
