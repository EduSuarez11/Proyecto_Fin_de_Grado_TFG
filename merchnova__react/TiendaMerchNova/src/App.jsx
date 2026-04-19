import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import Layout from "./componentes/ZonaTienda/Layout/Layout";
import Home from "./componentes/ZonaTienda/Inicio/Home";
import Registro from "./componentes/ZonaCliente/Registro/Registro";
import Login from "./componentes/ZonaCliente/Login/Login";
import Productos from "./componentes/ZonaTienda/Productos/Productos";
import InfoProducto from "./componentes/ZonaTienda/Productos/DetalleProducto/InfoProducto";
import Carrito from "./componentes/ZonaTienda/Carrito/Carrito";
import PerfilCuenta from "./componentes/ZonaCliente/ZonaPanelCuenta/1_Perfil/Perfil";
import CarritoCuenta from "./componentes/ZonaCliente/ZonaPanelCuenta/4_CarritoCuenta/MiCarritoCuenta";
import TipoLogin from "./componentes/ZonaCliente/Login/TipoLogin";
import LoginCallback from "./componentes/ZonaCliente/Login/Proceso_Login/DiscordCallback";
import peticiones_fetch from "./componentes/Servicios/peticiones_fetch";
import FinPedido from "./componentes/ZonaTienda/FinalPedido/Fin_Pedido";
import Cuenta from "./componentes/ZonaCliente/ZonaPanelCuenta/Cuenta";
import Direcciones from "./componentes/ZonaTienda/FinalPedido/Datos_direcciones/Direcciones_1";
import CompraFinalizada from "./componentes/ZonaTienda/FinalPedido/Compra_exito/CompraFinalizada";
import Pedidos from "./componentes/ZonaCliente/ZonaPanelCuenta/2_Pedidos/Pedidos";
import MisDirecciones from "./componentes/ZonaCliente/ZonaPanelCuenta/3_Direcciones/Direcciones";
import requestFetch from "./componentes/Servicios/peticiones_fetch";


const optionsPayPal = {
   "client-id": "AeY68Ia4Z3-o5_SywvO07s5-ZH6e8Np7M0zMomQ5RJAHO59ItUDuUBMKQGEqhu2tmZg-hkogNNYHOWV9",
   currency: "EUR",
   intent: "capture"
}

const requestHome = async () => {
   const productsRequest = await fetch('http://localhost:3000/api/Tienda/Productos/Home');
   const response = await productsRequest.json();
   //console.log('Productos cargados: ', response.data);
   // #region ------------------------ Respuesta node ---------------------
   /* Objeto response:
       {
           code: 0
           message: '...',
           data: {
               clientData: {nombreCompleto: '...'},
           }
       }
           */
   //#endregion ------------------------------------------------------------
   return response;
}

const getChosenProduct = async ({ params }) => {
   //console.log('parametro url: ', params);
   const requestProduct = await fetch(`http://localhost:3000/api/Tienda/Producto/${params.categoria}/${params.slug}`);
   const response = await requestProduct.json();
   return response;
}

const getAllProducts = async () => {
   const requestProduct = await fetch(`http://localhost:3000/api/Tienda/Productos`);
   const response = await requestProduct.json();
   return response;
}


const securityApplication = () => {
   const token = sessionStorage.getItem('token');
   if (!token) throw redirect('/Cliente/TipoLogin');
}


const applicationRoutes = createBrowserRouter(
   [
      {
         element: <Layout />,
         children: [
            {
               path: '/',
               element: <Home />,
               loader: requestHome
            },

            {
               path: 'Cliente',
               children: [
                  { path: 'Registro', element: <Registro /> },
                  { path: 'Login', element: <Login /> },
                  { path: 'TipoLogin', element: <TipoLogin /> },
                  {
                     path: 'Cuenta', element: <Cuenta />, loader: securityApplication, children: [
                        { path: 'Perfil', element: <PerfilCuenta />, loader: peticiones_fetch.requestGetCountries },
                        { path: 'Pedidos', element: <Pedidos /> },
                        { path: 'MisDirecciones', element: <MisDirecciones />, loader: peticiones_fetch.requestGetCountries },
                        { path: 'MiCarrito', element: <CarritoCuenta /> }
                     ]
                  },
                  { path: 'MiCarrito', element: <CarritoCuenta />, loader: getAllProducts },
               ]
            },

            {
               path: 'Portal', children: [
                  {
                     path: 'Pedido', loader: securityApplication, children: [
                        { path: 'DetallesEncargo', element: <FinPedido />, loader: peticiones_fetch.requestGetCountries },
                        { path: 'CompraExitosa', element: <CompraFinalizada /> }
                     ]
                  },

                  {
                     path: 'Productos',
                     element: <Productos />,
                     loader: getAllProducts
                  },

                  {
                     path: 'Producto/:categoria/:slug',
                     element: <InfoProducto />,
                     loader: getChosenProduct
                  },

                  {
                     path: 'Cart',
                     element: <Carrito />,
                     loader: getAllProducts
                  },
               ]
            },

            {
               path: 'Proceso-Login-Discord',
               element: <LoginCallback />
            },

            { path: '*', element: <div className="container d-flex justify-content-center mt-4"><img src="../public/logo_images/error.png" style={{ width: '800px' }} /></div> }
         ]
      }
   ]);

function App() {

   return (
      <PayPalScriptProvider options={optionsPayPal}>
         <RouterProvider router={applicationRoutes}></RouterProvider>
      </PayPalScriptProvider>
   );
}

export default App;
