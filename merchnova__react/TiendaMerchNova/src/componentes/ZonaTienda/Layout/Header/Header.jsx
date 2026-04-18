import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import useGlobalState from '../../../../global_state/globalState';
import Panel from '../../../ZonaCliente/ZonaPanelCuenta/Panel/Panel';
import { useEffect, useRef, useState } from 'react';
import requestFetch from '../../../Servicios/peticiones_fetch';

function Header() {
    const route = useLocation();
    const { clientData, logOut, order, setClientData } = useGlobalState();
    const refPanel = useRef(null);
    const [showPanel, setShowPanel] = useState(false);
    const [categories, setCategories] = useState([]);

    const showButtonsSession = (routeComponent) => routeComponent !== '/Cliente/Registro' && routeComponent !== '/Cliente/Login';

    function handleShowPanel() {
        if (refPanel.current) {
            clearTimeout(refPanel.current);
            refPanel.current = null;
        }
        setShowPanel(true);
    }

    function handleHiddenPanel() {
        if (refPanel.current) {
            clearTimeout(refPanel.current);
            refPanel.current = null;
        }
        refPanel.current = setTimeout(() => {
            setShowPanel(false);
            refPanel.current = null;
        }, 250);
    }

    function handleShowPanelFromInside() {
        if (refPanel.current) clearTimeout(refPanel.current);
        setShowPanel(true);
    }

    useEffect(() => {
        const getCategories = async () => {
            const response = await requestFetch.getCategories();
            setCategories(response.categories);
        }
        getCategories();
    }, []);

    useEffect(
        () => {
            const token = sessionStorage.getItem("token");

            if (token) {
                const timeRes = setTimeout(async () => {
                    const requestVerifyToken = await fetch('http://localhost:3000/api/Cliente/Verify/Token', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const responseVT = await requestVerifyToken.json();
                    console.log('Respuesta: ', responseVT);
                    if (responseVT.code === 0) {
                        setClientData(responseVT.data.user);
                    }
                }, 10)
                return () => clearTimeout(timeRes);
            }
        }, []
    );

    //console.log('Cliente: ', clientData)
    /** #region ------------------- Datos cliente ---------------------------
     * Objeto clientData:
        {
            "nombreCompleto": "...",
            "cuenta": {
                "email": "...",
                "password": "...",
                "genero": "...",
                "cuentaActiva": true,
                "imagenCuenta": "..."
                "creacionCuenta": Date.now()
                },
            "pedidos": [],
            "carrito": [],
            "direcciones": []
        }
     #endregion --------------------------------*/

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark navbar-merchnova px-4">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand d-flex align-items-center fw-bold logo-mn">
                        <img src="/logo_images/logo_tienda.png" className="logo-navbar rounded-circle rounded-5" alt="MerchNova logo" />
                        <span className="ms-2">MerchNova</span>
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {showButtonsSession(route.pathname) ?

                        <div className="collapse navbar-collapse" id="navbarContent">
                            <form className="d-flex mx-auto search-bar">
                                <input className="form-control me-2" type="search" placeholder="Buscar productos..." />
                                <button className="btn btn-light" type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>

                            {
                                clientData == null ?
                                    <div className="d-flex align-items-center gap-3">
                                        <Link to='/Portal/Cart' className="cart-icon">
                                            <i className="bi bi-cart3">
                                                <span className="position-absolute translate-middle badge bg-danger size-qty">
                                                    {order.items.length}
                                                </span>
                                            </i>
                                        </Link>

                                        <Link to="/Cliente/TipoLogin">
                                            <button className="btn btn-outline-light btn-sm">
                                                Iniciar sesión
                                            </button>
                                        </Link>

                                        <Link to="/Cliente/Registro">
                                            <button className="btn btn-light btn-sm fw-semibold">
                                                Registrarse
                                            </button>
                                        </Link>
                                    </div>
                                    :
                                    <Panel order={order} clientData={clientData} logOut={logOut} />
                            }
                        </div>
                        :
                        <Link to='/'>
                            <button className="btn btn-light btn-sm fw-semibold">
                                Volver
                            </button>
                        </Link>

                    }
                </div>
            </nav>

            <nav className="subnav">
                <div className="subnav-container">
                    <div className="subnav-item has-dropdown" onMouseEnter={handleShowPanel} onMouseLeave={handleHiddenPanel} >Productos</div>

                    {
                        showPanel &&
                        <div className="menu-panel" onMouseEnter={handleShowPanelFromInside} onMouseLeave={handleHiddenPanel}>
                            <div className="grid-panel">

                                {
                                    categories.map((el, pos) =>
                                        <div className="category" key={pos}>{el.nombreCat}</div>
                                    )
                                }
                                {/* <div className="category">Camisetas</div>
                                <div className="category">Sudaderas</div>
                                <div className="category">Tazas</div>
                                <div className="category">Llaveros</div>

                                <div className="category">Posters</div>
                                <div className="category">Peluches</div> */}
                            </div>
                        </div>

                    }


                    <div className="subnav-item">Ofertas</div>

                    <div className="subnav-item">Más información</div>
                </div>
            </nav>
        </>
    );
}

export default Header;
