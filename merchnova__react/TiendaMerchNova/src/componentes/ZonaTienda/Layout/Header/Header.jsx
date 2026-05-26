import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import useGlobalState from '../../../../global_state/globalState';
import Panel from '../../../ZonaCliente/ZonaPanelCuenta/Panel/Panel';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { request_category } from '../../../Servicios/peticiones_productos/request_products';
import { useMemo } from 'react';
import { request_auth, request_get_token } from '../../../Servicios/peticiones_auth_frontend/request_auth';
import socket_io__client_service from '../../../Servicios/socket_io_client/socket_io__client_service';

function Header() {
    const route = useLocation();
    const { clientData, logOut, order, setClientData } = useGlobalState();
    const refPanel = useRef(null);
    const [newMessages, setNewMessages] = useState(false);
    const [chatId, setChatId] = useState('');
    const [showPanel, setShowPanel] = useState({
        products: false,
        soporte: false,
        info: false
    });
    const [categories, setCategories] = useState([]);
    const doubleRequest = useRef(false);

    const showButtonsSession = (routeComponent) => routeComponent !== '/Cliente/Registro' && routeComponent !== '/Cliente/Login';

    function handleShowPanel(ev) {
        if (refPanel.current) {
            clearTimeout(refPanel.current);
            refPanel.current = null;
        }
        setShowPanel({ ...showPanel, [ev.target.id]: true });
    }

    function handleHiddenPanel(ev) {
        if (refPanel.current) {
            clearTimeout(refPanel.current);
        }
        refPanel.current = setTimeout(() => {
            setShowPanel({ ...showPanel, [ev.target.id]: false });
            refPanel.current = null;
        }, 50);
    }

    function handleShowPanelFromInside(ev) {
        if (refPanel.current) clearTimeout(refPanel.current);
        setShowPanel({ ...showPanel, [ev.target.id]: true });
    }

    useEffect(() => {
        const getCategories = async () => {
            const response = await request_category.get_categories();
            setCategories(response.categories);
        }
        getCategories();

    }, []);

    useEffect(
        () => {
            const token = sessionStorage.getItem("token");

            if (token) {
                const timeRes = setTimeout(async () => {
                    const responseVT = await request_get_token.token_verify(token);
                    console.log('Respuesta: ', responseVT);
                    if (responseVT.code === 0) {
                        setClientData(responseVT.data.user);
                    }
                }, 10)
                return () => clearTimeout(timeRes);
            }
        }, []
    );

    const getMsg = useEffectEvent(
        (data) => {
            const { salaId, datosCliente, datosAdmin, firstMsg } = JSON.parse(data);
            let { estado } = JSON.parse(data);
            const clientUp = useGlobalState.getState().clientData;

            if (clientUp._id && clientUp._id === datosAdmin.idAdmin && !doubleRequest.current) {
                doubleRequest.current = true
                setNewMessages(true);
                console.log('Admin uniendose al chat');
                estado = 'ACTIVO';
                console.log('Chat estado: ', estado);
                socket_io__client_service.sendMessage('adminJoinRoom', JSON.stringify({ keyChat: salaId, datosAdmin }));
                useGlobalState.getState().setClientData({
                    ...clientUp,
                    chats: [
                        ...clientUp?.chats,
                        { _id: salaId, datosCliente, datosAdmin, mensajes: [firstMsg], estado }
                    ]
                });
                setChatId(salaId);
            } else if (route.pathname !== '/Portal/Soporte/Chat') {
                setNewMessages(true);
            }
        }
    )

    useEffect(
        () => {
            socket_io__client_service.receiveEvent('adminJoinRoom', getMsg)
        }, []
    )

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
        <div className='h-100'>
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
                                clientData === null ?
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

            {(route.pathname !== '/Cliente/Login' && route.pathname !== '/Cliente/Registro') &&
                <nav className="subnav">
                    <div className="subnav-container">
                        <Link to='/Portal/Productos?page=1&categoria=todos'>
                            <div className="subnav-item has-dropdown" id='products' onMouseEnter={(ev) => handleShowPanel(ev)} onMouseLeave={(ev) => handleHiddenPanel(ev)}>Productos</div>
                        </Link>
                        {showPanel.products &&
                            <div className="menu-panel" onMouseEnter={(ev) => handleShowPanelFromInside(ev)} onMouseLeave={(ev) => handleHiddenPanel(ev)}>
                                <div className="grid-panel" style={showPanel.products && { gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                    {categories.map((el, pos) =>
                                        <Link className="text-decoration-none" style={{ color: 'inherit' }} to={`/Portal/Productos?page=1&categoria=${el.nombreCat.toLowerCase()}`} key={pos}>
                                            <div className="category fw-medium" key={pos}>{el.nombreCat}</div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        }


                        <div className="subnav-item has dropdown" id="soporte" onMouseEnter={(ev) => handleShowPanel(ev)} onMouseLeave={(ev) => handleHiddenPanel(ev)}>
                            Soporte
                            {(newMessages) && <span className="badge bg-danger" style={{ top: '0', right: '0', transform: 'translate(50%, -50%)' }}>!</span>}
                        </div>

                        {showPanel.soporte &&
                            <div className="menu-panel" onMouseEnter={(ev) => handleShowPanelFromInside(ev)} onMouseLeave={(ev) => handleHiddenPanel(ev)}>
                                <div className="grid-panel" style={showPanel.soporte && { gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                    {['Ayuda', "Chat"].map((el, pos) =>
                                        <Link className="text-decoration-none" style={{ color: 'inherit' }} to={!newMessages ? `/Portal/Soporte/${el}` : `/Portal/Soporte/${el}/${chatId}`} key={pos}>
                                            <div className="category fw-medium" onClick={(ev) => el === 'Chat' && setNewMessages(false)}>
                                                {el} {(newMessages && el === 'Chat') && <span className="badge bg-danger" style={{ top: '0', right: '0', transform: 'translate(50%, -50%)' }}>!</span>}
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        }


                        <div className="subnav-item has-dropdown" id='info' onMouseEnter={(ev) => handleShowPanel(ev)} onMouseLeave={(ev) => handleHiddenPanel(ev)}>Más información</div>
                        {showPanel.info &&
                            <div className="menu-panel" onMouseEnter={(ev) => handleShowPanelFromInside(ev)} onMouseLeave={(ev) => handleHiddenPanel(ev)}>
                                <div className="grid-panel" style={showPanel.info && { gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                    {['Sobre Nosotros', "Como Funciona"].map((el, pos) =>
                                        <Link className="text-decoration-none" style={{ color: 'inherit' }} to={`/Portal/Informacion/${el.replace(/\s+/g, '')}`} key={pos}>
                                            <div className="category fw-medium">{el}</div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                </nav>
            }

        </div>
    );
}

export default Header;
