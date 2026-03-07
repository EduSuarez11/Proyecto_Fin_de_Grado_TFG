import { Link } from 'react-router-dom';
import './Header.css';

function Header() {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-merchnova px-4">
            <div className="container-fluid">
                <a className="navbar-brand d-flex align-items-center fw-bold logo-mn" href="#">
                    <img src="logo_tienda.png" className="logo-navbar rounded-circle rounded-5" alt="MerchNova logo" />
                    <span className="ms-2">MerchNova</span>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <form className="d-flex mx-auto search-bar">
                        <input className="form-control me-2" type="search" placeholder="Buscar productos..." />
                        <button className="btn btn-light" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>

                    <div className="d-flex align-items-center gap-3">
                        <a href="#" className="cart-icon">
                            <i className="bi bi-cart3"></i>
                        </a>

                        <Link to="/Cliente/Login">
                            <button className="btn btn-outline-light btn-sm" >
                                Iniciar sesión
                            </button>
                        </Link>

                        <Link to="/Cliente/Registro">
                            <button className="btn btn-light btn-sm fw-semibold">
                                Registrarse
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
