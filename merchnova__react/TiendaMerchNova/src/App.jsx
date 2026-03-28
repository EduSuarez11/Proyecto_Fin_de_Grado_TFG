import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const getAllCountries = async () => {
   const requestCountries = await fetch('https://restcountries.com/v3.1/all?fields=name,flags',
      {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' }
      }
   );
   const responseCountries = await requestCountries.json();
   console.log('Paises: ', responseCountries);
   return responseCountries;
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
                  { path: 'Perfil', element: <PerfilCuenta />, loader: getAllCountries },
                  { path: 'MiCarrito', element: <CarritoCuenta />, loader: getAllProducts },
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

            { path: '*', element: <div className="container d-flex justify-content-center mt-4"><img src="../public/logo_images/error.png" style={{ width: '800px' }} /></div> }
         ]
      }
   ]);

function App() {

   return (
      <>
         <RouterProvider router={applicationRoutes}></RouterProvider>
      </>
   );
}

export default App;
