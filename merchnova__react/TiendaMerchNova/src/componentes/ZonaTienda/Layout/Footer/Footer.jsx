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
                            <li><a href="#">Camisetas</a></li>
                            <li><a href="#">Sudaderas</a></li>
                            <li><a href="#">Pósters</a></li>
                            <li><a href="#">Accesorios</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h6 className="footer-title">Soporte</h6>
                        <ul className="footer-links">
                            <li><a href="#">Contacto</a></li>
                            <li><a href="#">Preguntas frecuentes</a></li>
                            <li><a href="#">Devoluciones</a></li>
                            <li><a href="#">Envíos</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h6 className="footer-title">Síguenos</h6>
                        <div className="footer-socials">
                            <a href="#"><i className="bi bi-instagram"></i></a>
                            <a href="#"><i className="bi bi-twitter-x"></i></a>
                            <a href="#"><i className="bi bi-youtube"></i></a>
                            <a href="#"><i className="bi bi-tiktok"></i></a>
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
