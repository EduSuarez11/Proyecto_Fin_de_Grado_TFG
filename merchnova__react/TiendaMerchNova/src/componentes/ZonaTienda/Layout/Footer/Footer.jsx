import { Link } from 'react-router';
import './Footer.css';

function Footer() {

    return (
        <footer className="footer-merchnova">
            <div className="container">
                <div className="row">

                    <div className="col-md-4 mb-4">
                        <h5 className="footer-logo">MerchNova</h5>
                        <p className="footer-text">
                            Tu tienda de merchandising favorita. Encuentra camisetas, pósters,
                            accesorios y mucho más de tus franquicias favoritas.
                        </p>
                    </div>

                    <div className="col-md-2 mb-4">
                        <h6 className="footer-title">Tienda</h6>
                        <ul className="footer-links">
                            {
                                [
                                    {name: 'Camisetas', url: '/Portal/Productos?page=1&categoria=camisetas'},
                                    {name: 'Sudaderas', url: '/Portal/Productos?page=1&categoria=sudaderas'},
                                    {name: 'Pósters', url: '/Portal/Productos?page=1&categoria=posters'},
                                    {name: 'Más accesorios', url: '/Portal/Productos?page=1&categoria=todos'}
                                ].map((elem, pos) =>
                                    <li key={pos}><Link to={elem.url}>{elem.name}</Link></li>
                                )
                            }
                        </ul>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h6 className="footer-title">Soporte</h6>
                        <ul className="footer-links">
                            {
                                [
                                    {name: 'Contacto', url: '/Portal/Soporte/Ayuda'},
                                    {name: 'Preguntas frecuentes', url: '/Portal/Informacion/SobreNosotros'},
                                    {name: 'Devoluciones', url: '/Portal/Informacion/ComoFunciona#compras'},
                                    {name: 'Envíos', url: '/Portal/Informacion/ComoFunciona#pedidos'}
                                ].map((elem, pos) =>
                                    <li key={pos}><Link to={elem.url}>{elem.name}</Link></li>
                                )
                            }
                        </ul>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h6 className="footer-title">Síguenos</h6>
                        <div className="footer-socials">
                            {
                                [
                                    { url: 'https://instagram.com', icon: 'bi bi-instagram' },
                                    { url: 'https://x.com', icon: 'bi bi-twitter-x' },
                                    { url: 'https://youtube.com', icon: 'bi bi-youtube' },
                                    { url: 'https://tiktok.com', icon: 'bi bi-tiktok' }
                                ].map((elem, pos) =>
                                    <Link to={elem.url} target='_blank' key={pos}><i className={elem.icon}></i></Link>
                                )
                            }
                        </div>
                    </div>

                </div>

                <hr className="footer-divider" />

                <div className="text-center footer-bottom">
                    © 2026 MerchNova. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
