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
const URL = 'http://localhost:3000/';

export const request_products = {
    get_home_products: async () => {
        const productsRequest = await fetch(`${URL}api/products/Productos/Home`);
        const response = await productsRequest.json();
        //console.log('Productos cargados: ', response.data);

        return response;
    },

    get_all_products: async () => {
        const requestProduct = await fetch(`${URL}api/products/Productos`);
        const response = await requestProduct.json();
        return response;
    }
}

export const request_filter_products = {
    get_chosen_product: async ({ params }) => {
        const requestProduct = await fetch(`${URL}api/products/Chosen/${params.categoria}/${params.slug}`);
        const response = await requestProduct.json();
        return response;
    },

    // Peticion para obtener los productos por filtro
    get_products_filter: async (categories, page, minPrice, maxPrice, valoration) => {
        const request = await fetch(`${URL}api/products/FiltrarProductos?page=${page}&categoria=${categories}&minPrice=${minPrice}&maxPrice=${maxPrice}&valoracion=${valoration}`);
        const response = await request.json();

        return response;
    },
}

export const request_category = {
    get_categories: async () => {
        const request = await fetch(`${URL}api/products/Categorias`);
        const response = await request.json();

        return response;
    }
}