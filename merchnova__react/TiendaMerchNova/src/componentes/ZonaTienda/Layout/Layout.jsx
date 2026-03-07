import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

function Layout() {

    return (
        <div className='container-fluid p-0'>
            <Header />

            <Outlet />

            <Footer />
        </div>
    )
}

export default Layout;
