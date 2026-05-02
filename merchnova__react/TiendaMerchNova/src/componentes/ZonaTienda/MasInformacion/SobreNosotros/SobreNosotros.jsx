import { Link } from 'react-router';
import './SobreNosotros.css'

function SobreNosotros() {
    return (
        <div className="container bg-banner">
            {/* HERO */}
            <section className="about-hero mt-4">
                <div className="about-hero-content">
                    <span className="about-badge">✨ Sobre MerchNova</span>

                    <h1 className='title-info'>Productos únicos creados para fans</h1>

                    <p>En MerchNova creemos que cada fan merece productos especiales que representen sus
                        gustos, videojuegos, personajes y universos favoritos.
                    </p>
                </div>

                {/* IMAGEN */}
                <div className="about-hero-image">
                    {/* TU IMAGEN */}
                    <div className="image-placeholder">Imagen de la tienda</div>
                </div>
            </section>

            {/* HISTORIA */}
            <section className="about-section">
                <div className="section-title">
                    <span>Nuestra historia</span>
                    <h2 className='title-info'>¿Cómo nació MerchNova?</h2>
                </div>

                <p>MerchNova nació con una idea sencilla: crear una tienda moderna donde cualquier fan
                    pueda encontrar productos originales, personalizados y diseñados con cariño.
                </p>

                <p>Desde camisetas y sudaderas hasta tazas, pósteres, llaveros y peluches, buscamos ofrecer productos visualmente
                    atractivos, de calidad y con diseños que realmente conecten con las personas.
                </p>

                <p>Nuestro objetivo es convertir cada compra en una experiencia divertida y cercana, cuidando cada detalle desde el diseño
                    hasta la entrega final.
                </p>
            </section>

            {/* QUE VENDEMOS */}
            <section className="about-cards-section">
                <div className="section-title text-center">
                    <span>Lo que ofrecemos</span>
                    <h2 className='title-info'>Nuestros productos</h2>
                </div>

                <div className="about-cards-grid">
                    <div className="about-card">
                        <i className="bi bi-bag-heart"></i>
                        <h5>Camisetas y sudaderas</h5>
                        <p>Diseños originales inspirados en videojuegos, anime, cultura pop y personajes icónicos.
                        </p>
                    </div>

                    <div className="about-card">
                        <i className="bi bi-cup-hot"></i>
                        <h5>Tazas personalizadas</h5>
                        <p>Tazas con diseños exclusivos para acompañarte en tu día a día.</p>
                    </div>

                    <div className="about-card">
                        <i className="bi bi-stars"></i>
                        <h5>Pósteres y decoración</h5>
                        <p>
                            Decoración pensada para verdaderos
                            fans y amantes del coleccionismo.
                        </p>
                    </div>

                    <div className="about-card">
                        <i className="bi bi-controller"></i>
                        <h5>Merchandising friki</h5>
                        <p>
                            Productos únicos relacionados con
                            videojuegos y entretenimiento.
                        </p>
                    </div>
                </div>
            </section>

            {/* FILOSOFÍA */}
            <section className="about-section mt-4">
                <div className="section-title">
                    <span>Nuestra filosofía</span>
                    <h2 className='title-info'>Lo que nos importa</h2>
                </div>

                <div className="values-grid">
                    <div className="value-box">
                        <h5>💜 Calidad</h5>
                        <p>
                            Trabajamos para ofrecer productos
                            resistentes, cómodos y visualmente
                            atractivos.
                        </p>
                    </div>

                    <div className="value-box">
                        <h5>🚚 Envíos seguros</h5>
                        <p>
                            Nos preocupamos por que cada pedido
                            llegue correctamente y en el menor
                            tiempo posible.
                        </p>
                    </div>

                    <div className="value-box">
                        <h5>⭐ Experiencia</h5>
                        <p>
                            Queremos que navegar, comprar y
                            recibir tu producto sea una experiencia
                            sencilla y agradable.
                        </p>
                    </div>

                    <div className="value-box">
                        <h5>🎨 Originalidad</h5>
                        <p>
                            Apostamos por diseños creativos y
                            diferentes para destacar frente
                            a tiendas tradicionales.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta mb-4 px-2">
                <h2>Gracias por formar parte de MerchNova 🩷</h2>
                <p>Seguiremos trabajando para traerte nuevos productos, diseños y experiencias pensadas 
                    especialmente para fans como tú.
                </p>
                <Link to='/Portal/Productos?page=1&categoria=todos' className="btn btn-purple">Explorar productos</Link>
            </section>
        </div>
    )
}

export default SobreNosotros;
