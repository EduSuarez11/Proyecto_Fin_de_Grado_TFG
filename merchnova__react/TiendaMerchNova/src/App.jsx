import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js'
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
import FinPedido from "./componentes/ZonaTienda/FinalPedido/Fin_Pedido";
import Cuenta from "./componentes/ZonaCliente/ZonaPanelCuenta/Cuenta";
import Direcciones from "./componentes/ZonaTienda/FinalPedido/Datos_direcciones/Direcciones_1";
import CompraFinalizada from "./componentes/ZonaTienda/FinalPedido/Compra_exito/CompraFinalizada";
import Pedidos from "./componentes/ZonaCliente/ZonaPanelCuenta/2_Pedidos/Pedidos";
import MisDirecciones from "./componentes/ZonaCliente/ZonaPanelCuenta/3_Direcciones/Direcciones";
import RestablecerClave from "./componentes/ZonaCliente/Login/Restablecer_Clave/RestablecerClave";
import { stripePromise } from "./componentes/configurations/config";
import CompraCancelada from "./componentes/ZonaTienda/FinalPedido/Compra_cancelada/CompraCancelada";
import { request_filter_products, request_products } from "./componentes/Servicios/peticiones_productos/request_products";
import request_external from "./componentes/Servicios/request_external_api";
import PanelClientes from "./componentes/ZonaCliente/ZonaPanelCuenta/5_PanelClientes/PanelCliente";
import SobreNosotros from "./componentes/ZonaTienda/MasInformacion/SobreNosotros/SobreNosotros";
import { request_get_token } from "./componentes/Servicios/peticiones_auth_frontend/request_auth";
import { accountLogged, areaAdmin, securityApplication, securityChangePassword } from "./componentes/security/route_control";
import ErrorToken from "./componentes/ZonaCliente/Login/Restablecer_Clave/TokenExpirado/ErrorToken";
import Configuracion from "./componentes/ZonaTienda/Configuracion/Configuracion";
import InfoPerfil from "./componentes/ZonaTienda/Configuracion/Info_perfil/InfoPerfil";
import NuevaPassword from "./componentes/ZonaTienda/Configuracion/NuevaContraseña/NuevaPassword";
import Privacidad from "./componentes/ZonaTienda/Configuracion/Privacidad/Privacidad";
import EliminarCuenta from "./componentes/ZonaTienda/Configuracion/Eliminar_cuenta/EliminarCuenta";
import Chat from "./componentes/ZonaTienda/Chat/Chat";
import DescripcionSoporte from "./componentes/ZonaTienda/Chat/DescripcionSoporte/DescripcionSoporte";
import ComoFunciona from "./componentes/ZonaTienda/MasInformacion/Funcionamiento/ComoFunciona";


const optionsPayPal = {
   "client-id": "AeY68Ia4Z3-o5_SywvO07s5-ZH6e8Np7M0zMomQ5RJAHO59ItUDuUBMKQGEqhu2tmZg-hkogNNYHOWV9",
   currency: "EUR",
   intent: "capture"
}


const requestHome = async () => {
   const response = await request_products.get_home_products();
   return response;
}

const getChosenProduct = async ({ params }) => {
   console.log(params)
   const response = await request_filter_products.get_chosen_product({ params });
   return response;
}

const getAllProducts = async () => {
   const response = await request_products.get_all_products();
   return response;
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
                  { path: 'Registro', element: <Registro />, loader: accountLogged },
                  { path: 'Login', element: <Login />, loader: accountLogged },
                  { path: 'TipoLogin', element: <TipoLogin />, loader: accountLogged },
                  {
                     path: 'Cuenta', element: <Cuenta />, loader: securityApplication, children: [
                        { path: 'Perfil', element: <PerfilCuenta />, loader: request_external.request_get_countries },
                        { path: 'Pedidos', element: <Pedidos /> },
                        { path: 'MisDirecciones', element: <MisDirecciones />, loader: request_external.request_get_countries },
                        { path: 'MiCarrito', element: <CarritoCuenta /> },
                        { path: 'PanelClientes', element: <PanelClientes />, loader: areaAdmin },
                     ]
                  },
                  {
                     path: 'Configuración', element: <Configuracion />, loader: securityApplication, children: [
                        { path: 'InfoPerfil', element: <InfoPerfil /> },
                        { path: 'CambiarPassword', element: <NuevaPassword /> },
                        { path: 'Privacidad', element: <Privacidad /> },
                        { path: 'EliminarCuenta', element: <EliminarCuenta /> }
                     ]
                  },
                  { path: 'MiCarrito', element: <CarritoCuenta />, loader: getAllProducts },
                  { path: 'CambiarClave/:clientId/:token', element: <RestablecerClave />, loader: securityChangePassword },
                  { path: 'ErrorCambioClave', element: <ErrorToken /> }
               ]
            },

            {
               path: 'Portal', children: [
                  {
                     path: 'Pedido', loader: securityApplication, children: [
                        { path: 'DetallesEncargo', element: <FinPedido />, loader: request_external.request_get_countries },
                        { path: 'CompraExitosa', element: <CompraFinalizada /> },
                        { path: 'CompraCancelada', element: <CompraCancelada /> }
                     ]
                  },

                  {
                     path: 'Informacion', children: [
                        { path: 'SobreNosotros', element: <SobreNosotros /> },
                        { path: 'ComoFunciona', element: <ComoFunciona /> }
                     ]
                  },


                  {
                     path: 'Soporte', children: [
                        { path: 'Ayuda', element: <DescripcionSoporte /> },
                        { path: 'Chat/:salaId?', element: <Chat />, loader: securityApplication }
                     ]
                  },

                  { path: 'Productos', element: <Productos /> },

                  { path: 'Producto/:categoria/:slug', element: <InfoProducto />, loader: getChosenProduct },

                  { path: 'Cart', element: <Carrito />, loader: getAllProducts },
               ]
            },

            { path: 'Proceso-Login-Discord', element: <LoginCallback /> },

            { path: '*', element: <div className="container d-flex justify-content-center mt-4"><img src="../../logo_images/error.png" style={{ width: '800px' }} /></div> }
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
