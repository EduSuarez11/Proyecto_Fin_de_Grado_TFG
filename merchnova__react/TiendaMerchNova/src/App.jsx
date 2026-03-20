import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./componentes/ZonaTienda/Layout/Layout";
import Home from "./componentes/ZonaTienda/Inicio/Home";
import Registro from "./componentes/ZonaCliente/Registro/Registro";
import Login from "./componentes/ZonaCliente/Login/Login";
import Productos from "./componentes/ZonaTienda/Productos/Productos";
import InfoProducto from "./componentes/ZonaTienda/Productos/DetalleProducto/InfoProducto";
import Carrito from "./componentes/ZonaTienda/Carrito/Carrito";

const requestHome = async () => {
   const productsRequest = await fetch('http://localhost:3000/api/Tienda/Productos/Home');
   const response = await productsRequest.json();
   //console.log('Productos cargados: ', response.data);
   return response;
}

const getChosenProduct = async ({ params }) => {
   //console.log('parametro url: ', params);
   const requestProduct = await fetch(`http://localhost:3000/api/Tienda/Producto/Camiseta/${params.slug}`);
   const response = await requestProduct.json();

   return response;
}

const getAllProducts = async () => {
   //console.log('parametro url: ', params);
   const requestProduct = await fetch(`http://localhost:3000/api/Tienda/Productos`);
   const response = await requestProduct.json();

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
                  { path: 'Registro', element: <Registro /> },
                  { path: 'Login', element: <Login /> }
               ]
            },

            {
               path: 'Productos',
               element: <Productos />,
               loader: getAllProducts
            },

            {
               path: 'Producto/Camiseta/:slug',
               element: <InfoProducto />,
               loader: getChosenProduct
            },

            {
               path: 'Cart',
               element: <Carrito/>,
               loader: getAllProducts
            },
            {path: '*', element: <div className="container d-flex justify-content-center mt-4"><img src="../public/logo_images/error.png" style={{width: '800px'}}/></div>}
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
