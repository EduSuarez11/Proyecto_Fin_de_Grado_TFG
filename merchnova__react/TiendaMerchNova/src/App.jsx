import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./componentes/ZonaTienda/Layout/Layout";
import Home from "./componentes/ZonaTienda/Inicio/Home";
import Registro from "./componentes/ZonaCliente/Registro/Registro";
import Login from "./componentes/ZonaCliente/Login/Login";
import Productos from "./componentes/ZonaTienda/Productos/Productos";

const applicationRoutes = createBrowserRouter(
   [
      {
         element: <Layout />,
         children: [
            {
               path: '/',
               element: <Home />,
               loader: async () => {
                  const productsRequest = await fetch('http://localhost:3000/api/Tienda/Productos');
                  const response = await productsRequest.json();
                  //console.log('Productos cargados: ', response.data);
                  return response;
               },
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
               element: <Productos />
            }
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
