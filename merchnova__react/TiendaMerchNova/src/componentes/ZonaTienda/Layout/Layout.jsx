import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import MiniFooter from './Footer/MiniFooter/MiniFooter';

function Layout() {
    const route = useLocation();

    return (
        <div className='container-fluid p-0'>
            <Header />

            <Outlet />

            {route.pathname !== '/Cliente/Login' && route.pathname !== '/Cliente/Registro' ? <Footer /> : <MiniFooter/>}
        </div>
    )
}

export default Layout;
