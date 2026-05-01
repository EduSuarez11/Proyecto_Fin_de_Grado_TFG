import { useEffect } from 'react';
import useGlobalState from '../../../global_state/globalState';
import './Carrito.css';
import { Link } from 'react-router-dom';
import Item from './Item_Carrito/Item';

function Carrito() {
    const { order, clientData } = useGlobalState();
    //console.log('Productos: ', order);

    return (
        <div className="cart-page bg-light">
            <div className="cart-container">
                <nav className="breadcrumb">
                    <Link to='/'>Inicio </Link>
                    <span className="mx-2">/</span>
                    <span className='current-product'>Carrito</span>
                </nav>
                <h1 className="cart-title">Tu carrito</h1>
                <div className="mb-3"><span className='me-2'>Tienes {clientData != null ? clientData.carrito.itemsPedido.length : order.items.length} producto(s)</span></div>
                
                    {/* Items del carrito */}
                    <Item />

            </div>
        </div>
    );
}

export default Carrito;
