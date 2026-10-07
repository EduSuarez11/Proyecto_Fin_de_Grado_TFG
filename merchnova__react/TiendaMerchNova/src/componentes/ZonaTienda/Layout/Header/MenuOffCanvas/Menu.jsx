import { Link } from 'react-router';
import './Menu.css';

function Menu() {
    const enlaces = [
        { label: "Membresía", url: "/Portal/Membresia" },
        { label: "Ruleta", url: "/Portal/Ruleta" },
        { label: "Canjear Puntos", url: "/Portal/ZonaPremios/CanjearPuntos" },
        { label: "Buscar Usuarios", url: "/Portal/Buscar/Usuarios" },
        { label: "Configuración", url: "/Cuenta/Configuración" }
    ];

    return (
        <>
            <div className="fs-4 text-white menu-bdg" role='button' data-bs-toggle="offcanvas" data-bs-target="#menuFuncionalidades" aria-controls="menuFuncionalidades">☰</div>
            <div className="offcanvas offcanvas-start menu-funcionalidades" data-bs-scroll="true" tabIndex="-1" id="menuFuncionalidades" aria-labelledby="menuFuncionalidadesLabel">
                {/* Cabecera */}
                <div className="offcanvas-header menu-funcionalidades-header">
                    <h5 className="offcanvas-title" id="menuFuncionalidadesLabel">Funcionalidades</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                </div>

                {/* Contenido */}
                <div className="offcanvas-body">
                    <div className="menu-funcionalidades-list">
                        { enlaces.map((el, pos) => <Link key={pos} to={el.url} className="menu-funcionalidades-item">{el.label}</Link>) }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Menu;