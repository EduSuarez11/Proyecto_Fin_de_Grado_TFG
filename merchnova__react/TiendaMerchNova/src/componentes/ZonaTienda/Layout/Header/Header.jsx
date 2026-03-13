import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { useState } from 'react';

function Header() {
    const [buttonsSession, setButtonsSession] = useState(false);
    const route = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-merchnova px-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center fw-bold logo-mn" onClick={route.pathname !== '/' && (() => setButtonsSession(false))}>
                    <img src="/logo_images/logo_tienda.png" className="logo-navbar rounded-circle rounded-5" alt="MerchNova logo" />
                    <span className="ms-2">MerchNova</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {!buttonsSession ?

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
                                <button className="btn btn-outline-light btn-sm" onClick={route.pathname !== '/Cliente/Login' && (() => setButtonsSession(true))}>
                                    Iniciar sesión
                                </button>
                            </Link>

                            <Link to="/Cliente/Registro">
                                <button className="btn btn-light btn-sm fw-semibold" onClick={route.pathname !== '/Cliente/Registro' && (() => setButtonsSession(true))}>
                                    Registrarse
                                </button>
                            </Link>
                        </div>
                    </div>
                    :
                    <Link to='/'>
                        <button className="btn btn-light btn-sm fw-semibold" onClick={route.pathname !== '/' && (() => setButtonsSession(false))}>
                            Volver
                        </button>
                    </Link>

                }
            </div>
        </nav>
    );
}

export default Header;
