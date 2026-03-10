import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

function Layout() {
    const route = useLocation();

    return (
        <div className='container-fluid p-0'>
            <Header />

            <Outlet />

            {route.pathname === '/' ? <Footer/> : ""}
            {/* <Footer /> */}
        </div>
    )
}

export default Layout;
