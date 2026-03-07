import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./componentes/ZonaTienda/Layout/Layout";
import Home from "./componentes/ZonaTienda/Inicio/Home";
import Registro from "./componentes/ZonaCliente/Registro/Registro";
import Login from "./componentes/ZonaCliente/Login/Login";

const applicationRoutes = createBrowserRouter(
   [
      {
         element: <Layout />,
         children: [
            { path: '/', element: <Home /> },
            {
               path: 'Cliente',
               children: [
                  { path: 'Registro', element: <Registro /> },
                  { path: 'Login', element: <Login /> }
               ]
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
