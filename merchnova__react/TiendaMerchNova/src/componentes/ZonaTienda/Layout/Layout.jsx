import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import MiniFooter from './Footer/MiniFooter/MiniFooter';
import { useMemo } from 'react';

function Layout() {
    const route = useLocation();

    const categorias = useMemo(
        () => {

        }, []
    )

    return (
        <>
            {
                route.pathname !== '/Cliente/TipoLogin' ?
                    <div className='container-fluid p-0'>
                        <Header />

                        <Outlet />

                        {route.pathname !== '/Cliente/Login' && route.pathname !== '/Cliente/Registro' ? <Footer /> : <MiniFooter />}
                    </div>
                    :
                    <div className='container-fluid p-0'>
                        <Outlet />
                    </div>
            }

        </>
    )
}

export default Layout;
